/**
 * useVideoCall
 * ------------
 * A single, self-contained, cross-platform hook encapsulating ALL WebRTC
 * and signalling logic for the TutorAid video-calling feature.
 *
 * Replaces the previously duplicated video.tsx (native) and video.web.tsx
 * (web) implementations with one unified code path.
 */

import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { videoCallConfig } from './config';
import { SignalingClient } from './signalingClient';
import { VideoCallError, ChatMessage, ConnectionState } from './types';

/* ----------------------------------------------------------------------- */
/*  Platform-specific WebRTC primitive resolution                          */
/* ----------------------------------------------------------------------- */

const isWeb = Platform.OS === 'web' && typeof window !== 'undefined';

let RTCView: any = null;
let mediaDevices: any = null;
let RTCPeerConnection: any = null;
let RTCSessionDescription: any = null;
let RTCIceCandidate: any = null;
let MediaStreamCtor: any = null;

if (!isWeb) {
  const WebRTCModule = require('@stream-io/react-native-webrtc');
  RTCView = WebRTCModule.RTCView;
  mediaDevices = WebRTCModule.mediaDevices;
  RTCPeerConnection = WebRTCModule.RTCPeerConnection;
  RTCSessionDescription = WebRTCModule.RTCSessionDescription;
  RTCIceCandidate = WebRTCModule.RTCIceCandidate;
  MediaStreamCtor = WebRTCModule.MediaStream;
} else {
  RTCPeerConnection = (window as any).RTCPeerConnection;
  RTCSessionDescription = (window as any).RTCSessionDescription;
  RTCIceCandidate = (window as any).RTCIceCandidate;
  MediaStreamCtor = (window as any).MediaStream;
}

/* ----------------------------------------------------------------------- */
/*  Types                                                                  */
/* ----------------------------------------------------------------------- */

export interface UseVideoCallProps {
  classname: string;
  username: string;
  /**
   * The role of the current user. Teachers can screen-share without approval;
   * students must be granted permission by a teacher.
   * Defaults to "student".
   */
  role?: 'teacher' | 'student';
  serverUrl?: string;
  iceServers?: any[];
  autoJoin?: boolean;
}

export interface UseVideoCallResult {
  classname: string;
  currentUser: string;
  localStream: any;
  remoteStreams: Record<string, any>;
  remoteScreenStreams: Record<string, any>;
  localVideoRef: React.MutableRefObject<any>;
  remoteVideoRefs: React.MutableRefObject<Record<string, any>>;
  connectionState: ConnectionState;
  signallingConnected: boolean;
  signallingStateLabel: string;
  reconnecting: boolean;
  reconnectAttempt: number;
  error: VideoCallError | null;
  screenShareDeniedMsg: string | null;
  joinedUsers: string[];
  activeScreenSharer: string | null;
  raisedHands: string[];
  isHandRaised: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  /** The sharer's own local screen stream (only set while the local user shares). */
  localScreenStream: any;
  cameraDirection: 'front' | 'back';
    screenShareAvailable: boolean;
  /** True while a student's permission request is awaiting teacher approval. */
  screenSharePending: boolean;
  /** The username of a student requesting permission (teacher-side only). */
  screenShareRequest: string | null;
  totalUnread: number;
  chatTarget: string | null;
  chatMessages: Record<string, ChatMessage[]>;
  unreadCounts: Record<string, number>;
  isParticipantsVisible: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  switchCamera: () => void;
    toggleScreenShare: () => void;
  /** Teacher-approved a student's screen-share request. */
  grantScreenShare: (studentUsername: string) => void;
  /** Teacher-denied a student's screen-share request. */
  denyScreenShare: (studentUsername: string) => void;
  toggleHandRaise: () => void;
  endCall: () => void;
  openParticipants: () => void;
  closeParticipants: () => void;
  selectUserForChat: (user: string) => void;
  closeChat: () => void;
  sendChatMessage: (message: string) => void;
  retryConnection: () => void;
  RTCView: any;
  isWeb: boolean;
}


function mergeIceServers(defaults: any[], overrides?: any[]): any[] {
  if (!overrides || overrides.length === 0) return defaults;
  const map = new Map<string, any>();
  defaults.forEach((s) => map.set(String(s.urls), s));
  overrides.forEach((s) => map.set(String(s.urls), { ...s }));
  return Array.from(map.values());
}

export function useVideoCall({
  classname,
  username,
  role,
  serverUrl: overrideServerUrl,
  iceServers: overrideIceServers,
  autoJoin = true,
}: UseVideoCallProps): UseVideoCallResult {
  const currentUser = username;
  const signalingUrl = overrideServerUrl ?? videoCallConfig.signalingUrl;

  /* ---- Mutable refs (always current, avoid stale closures) ---- */
  const wsRef = useRef<SignalingClient | null>(null);
  const localStreamRef = useRef<any>(null);
  const screenStreamRef = useRef<any>(null);
  const screenSendersRef = useRef<Record<string, any[]>>({});
  const peerConnections = useRef<Record<string, any>>({});
  const remoteStreamsRef = useRef<Record<string, any>>({});
  const remoteScreenStreamsRef = useRef<Record<string, any>>({});
  const syntheticStreamsRef = useRef<Record<string, any>>({});
  const pendingOffersRef = useRef<Array<{ sender: string; sdp: any }>>([]);
  const localVideoRef = useRef<any>(null);
  const remoteVideoRefs = useRef<Record<string, any>>({});
  const chatTargetRef = useRef<string | null>(null);
  const cameraDirectionRef = useRef<'front' | 'back'>('front');
      const isScreenSharingRef = useRef(false);
  const activeScreenSharerRef = useRef<string | null>(null);
  /** Tracks whether screen tracks have been added to peer connections. */
  const screenTracksPublishedRef = useRef(false);
  /** Tracks whether a student's request is awaiting teacher approval. */
  const screenSharePendingRef = useRef(false);
  /** Username of the student who sent a permission request (teacher-side). */
  const screenShareRequestRef = useRef<string | null>(null);
  const isHandRaisedRef = useRef(false);

  /* ---- State (for re-renders) ---- */
  const [localStream, setLocalStream] = useState<any>(null);
  const [remoteStreams, setRemoteStreams] = useState<Record<string, any>>({});
  const [remoteScreenStreams, setRemoteScreenStreams] = useState<Record<string, any>>({});
  const [joinedUsers, setJoinedUsers] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [activeScreenSharer, setActiveScreenSharer] = useState<string | null>(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localScreenStream, setLocalScreenStream] = useState<any>(null);
  const [screenSharePending, setScreenSharePending] = useState(false);
  const [screenShareRequest, setScreenShareRequest] = useState<string | null>(null);
  const [screenShareDeniedMsg, setScreenShareDeniedMsg] = useState<string | null>(null);
  const [chatTarget, setChatTarget] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [isParticipantsVisible, setIsParticipantsVisible] = useState(false);
  const [raisedHands, setRaisedHands] = useState<string[]>([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [signallingConnected, setSignallingConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [error, setError] = useState<VideoCallError | null>(null);
  const [cameraDirection, setCameraDirection] = useState<'front' | 'back'>('front');
  const [totalUnread, setTotalUnread] = useState(0);

    // Only show the screen-share button when the browser actually supports
  // the Display Media API (getDisplayMedia).  Mobile browsers and non-secure
  // contexts don't, so showing the button there just produces NotSupportedError.
  const screenShareAvailable =
    isWeb &&
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices?.getDisplayMedia === 'function' &&
    typeof window !== 'undefined' &&
    window.isSecureContext;

  /* ---- Sync refs to state ---- */
  useEffect(() => { chatTargetRef.current = chatTarget; }, [chatTarget]);
  useEffect(() => { cameraDirectionRef.current = cameraDirection; }, [cameraDirection]);
    useEffect(() => { isScreenSharingRef.current = isScreenSharing; }, [isScreenSharing]);
  useEffect(() => { activeScreenSharerRef.current = activeScreenSharer; }, [activeScreenSharer]);
  useEffect(() => { screenSharePendingRef.current = screenSharePending; }, [screenSharePending]);
  useEffect(() => { screenShareRequestRef.current = screenShareRequest; }, [screenShareRequest]);
  useEffect(() => { isHandRaisedRef.current = isHandRaised; }, [isHandRaised]);

  /* ---- sendWsMessage ---- */
  const sendWsMessage = (type: string, body: any): boolean => {
    const client = wsRef.current;
    if (!client || !client.isConnected) {
      console.warn('Signaling socket not open — cannot send', type);
      return false;
    }
    return client.send(type, { ...body, classname, username: currentUser });
  };

  /* ---- Action refs (filled by mount useEffect) ---- */
            const actionsRef = useRef<{
    startScreenCapture: () => Promise<boolean>;
    acquireScreenStream: () => Promise<boolean>;
    stopScreenCapture: () => void;
    cleanupCall: () => void;
    renegotiateAll: (peer?: string) => Promise<void>;
  }>({
    startScreenCapture: async () => false,
    acquireScreenStream: async () => false,
    stopScreenCapture: () => {},
    cleanupCall: () => {},
    renegotiateAll: async () => {},
  });


  /* ---- Outside-facing control functions ---- */

  const toggleMute = () => {
    const tracks = localStreamRef.current?.getAudioTracks() ?? [];
    if (tracks.length === 0) return;
    tracks.forEach((track: any) => { track.enabled = !track.enabled; });
    setIsMuted((prev) => !prev);
  };

  const toggleCamera = () => {
    const tracks = localStreamRef.current?.getVideoTracks() ?? [];
    if (tracks.length === 0) return;
    tracks.forEach((track: any) => { track.enabled = !track.enabled; });
    setIsCameraOff((prev) => !prev);
  };

  const switchCamera = () => {
    if (isWeb) return;
    const tracks = localStreamRef.current?.getVideoTracks() ?? [];
    tracks.forEach((track: any) => {
      if (typeof track.switchCamera === 'function') track.switchCamera();
    });
    setCameraDirection((prev) => (prev === 'front' ? 'back' : 'front'));
  };

                    const toggleScreenShare = async () => {
    if (isScreenSharingRef.current) {
      // Currently sharing — stop.
      sendWsMessage('request_screen_share', { enable: false });
      return;
    }
    // If a student's request is currently pending (waiting for approval),
    // cancel it by stopping the local capture and clearing the pending flag.
    if (screenSharePendingRef.current) {
      if (screenStreamRef.current) {
        actionsRef.current.stopScreenCapture();
      }
      setScreenSharePending(false);
      screenSharePendingRef.current = false;
      return;
    }
    if (activeScreenSharerRef.current && activeScreenSharerRef.current !== currentUser) {
      setScreenShareDeniedMsg(
        `${activeScreenSharerRef.current} is currently sharing their screen.`
      );
      setTimeout(() => setScreenShareDeniedMsg(null), 4000);
      return;
    }

    if (role === 'teacher') {
      // Teachers can screen-share without requesting permission.
      // getDisplayMedia MUST be called from a user-gesture context.
      const ok = await actionsRef.current.startScreenCapture();
      if (ok) {
        sendWsMessage('request_screen_share', { enable: true });
      }
    } else {
      // Students must be approved by the teacher.
      // Call getDisplayMedia NOW (while we still have the user gesture),
      // then send the request. Tracks will be published to peers only
      // after the teacher grants approval.
      const ok = await actionsRef.current.acquireScreenStream();
      if (ok) {
        setScreenSharePending(true);
        screenSharePendingRef.current = true;
        sendWsMessage('request_screen_share', { enable: true });
      }
    }
  };

  /** Teacher approves a student's screen-share request. */
  const grantScreenShare = (studentUsername: string) => {
    sendWsMessage('screen_share_grant', { target: studentUsername, granted: true });
    setScreenShareRequest(null);
    screenShareRequestRef.current = null;
  };

  /** Teacher denies a student's screen-share request. */
  const denyScreenShare = (studentUsername: string) => {
    sendWsMessage('screen_share_grant', {
      target: studentUsername,
      granted: false,
      reason: 'Screen share request denied by teacher',
    });
    setScreenShareRequest(null);
    screenShareRequestRef.current = null;
  };

  const toggleHandRaise = () => {
    const next = !isHandRaisedRef.current;
    sendWsMessage('request_hand_raise', { raised: next });
    setIsHandRaised(next);
    isHandRaisedRef.current = next;
  };

  const endCall = () => {
    sendWsMessage('quit', {});
    actionsRef.current.cleanupCall();
  };

  const selectUserForChat = (user: string) => {
    setChatTarget(user);
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[user];
      setTotalUnread(Object.values(next).reduce((s, c) => s + c, 0));
      return next;
    });
  };

  const closeChat = () => { setChatTarget(null); };

  const sendChatMessage = (message: string) => {
    const target = chatTargetRef.current;
    if (!target) return;
    sendWsMessage('send_chat_message', { target, message });
    setChatMessages((prev) => {
      const next = { ...prev };
      const existing = next[target] ?? [];
      next[target] = [
        ...existing,
        { sender: currentUser, text: message, timestamp: Date.now() },
      ];
      return next;
    });
  };

  const openParticipants = () => { setIsParticipantsVisible(true); };
  const closeParticipants = () => {
    setIsParticipantsVisible(false);
    setChatTarget(null);
  };

  const retryConnection = () => {
    setError(null);
    setConnectionState('connecting');
    const client = wsRef.current;
    if (client) {
      // Reset backoff and reconnect.  Existing EventEmitter listeners
      // (registered in the mount useEffect) will fire on the new socket,
      // including the setupDevice() call on open.
      client.reconnect();
    } else if (autoJoin) {
      // No client instance at all — start fresh with full setup.
      const freshClient = new SignalingClient(signalingUrl, {
        classname,
        username: currentUser,
        role: role ?? 'student',
      });
      wsRef.current = freshClient;
      freshClient.on('open', () => {
        setConnectionState('connected');
        setSignallingConnected(true);
        setError(null);
      });
      freshClient.on('reconnecting', ({ attempt }: any) => {
        setReconnecting(true);
        setReconnectAttempt(attempt);
      });
      freshClient.on('close', () => setSignallingConnected(false));
      freshClient.on('error', () => {
        setError({ code: 'SIGNALING_ERROR', message: 'Signaling server connection failed' });
      });
      freshClient.connect();
    }
  };

  const signallingStateLabel = (() => {
    if (reconnecting) return `Reconnecting (${reconnectAttempt})…`;
    if (signallingConnected) return 'Connected';
    if (connectionState === 'connecting') return 'Connecting…';
    if (connectionState === 'error') return 'Error';
    if (connectionState === 'disconnected') return 'Disconnected';
    return 'Idle';
  })();


  /* ------------------------------------------------------------------ */
  /*  Main setup useEffect (runs once on mount)                         */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!autoJoin) return;

    const iceServers = mergeIceServers(videoCallConfig.iceServers, overrideIceServers);

    /* === Internal helpers (shared closure, all close over latest refs) === */

    const addRemoteStream = (peerId: string, stream: any) => {
      remoteStreamsRef.current[peerId] = stream;
      setRemoteStreams((prev) => ({ ...prev, [peerId]: stream }));
    };

    const addRemoteScreenStream = (peerId: string, stream: any) => {
      remoteScreenStreamsRef.current[peerId] = stream;
      setRemoteScreenStreams((prev) => ({ ...prev, [peerId]: stream }));
    };

    const createPeerConnection = (peer: string) => {
      if (peerConnections.current[peer]) {
        return peerConnections.current[peer];
      }

      const pc = new RTCPeerConnection({ iceServers });
      // @ts-ignore — custom negotiation flag
      pc._hasNegotiated = false;
      peerConnections.current[peer] = pc;

      pc.onicecandidate = (event: any) => {
        if (!event.candidate) return;
        sendWsMessage('send_ice_candidate', {
          target: peer,
          candidate: event.candidate.toJSON?.() || event.candidate,
        });
      };

      pc.ontrack = (event: any) => {
        const track = event.track;
        const label = (track?.label || '').toLowerCase();

        // Robust screen-share detection. Browsers don't reliably set a
        // "screen"-like label on *received* WebRTC tracks, so we detect in
        // this order of reliability:
        //   1. getSettings().displaySurface → 'monitor' | 'window' | 'browser'
        //   2. label heuristics
        //   3. A second video track from a peer that already sends camera = screen
        let isScreenTrack = false;
        if (track?.kind === 'video') {
          try {
            const settings = track.getSettings?.();
            if (settings?.displaySurface) isScreenTrack = true;
          } catch { /* ignore */ }
          if (!isScreenTrack) {
            isScreenTrack =
              label.includes('screen') || label.includes('display') || label.includes('window');
          }
          if (!isScreenTrack) {
            // Peer already sends a camera video track → this extra video is the screen share.
            const alreadyHasCam = remoteStreamsRef.current[peer];
            if (alreadyHasCam && alreadyHasCam.getVideoTracks().length > 0) {
              isScreenTrack = true;
            }
          }
          if (!isScreenTrack) {
            // The server has told us this peer is currently sharing their screen.
            if (activeScreenSharerRef.current === peer) {
              isScreenTrack = true;
            }
          }
        }

        let stream = event.streams?.[0];

        if (!stream) {
          // Fallback: construct/reuse a MediaStream for this peer (some browsers
          // don't populate event.streams, especially for renegotiation).
          const key = (isScreenTrack ? 'screen:' : '') + peer;
          stream = syntheticStreamsRef.current[key];
          if (!stream) {
            stream = new MediaStreamCtor();
            syntheticStreamsRef.current[key] = stream;
          }
          stream.addTrack(track);
        }

        if (stream) {
          if (isScreenTrack) {
            addRemoteScreenStream(peer, stream);
          } else {
            addRemoteStream(peer, stream);
          }
        }
      };

      pc.onremovetrack = (event: any) => {
        const track = event.track;
        const label = (track?.label || '').toLowerCase();
        const isScreenTrack =
          track?.kind === 'video' &&
          (label.includes('screen') || label.includes('display') || label.includes('window'));

        const isScreen = isScreenTrack;
        const stream = isScreen
          ? remoteScreenStreamsRef.current[peer]
          : remoteStreamsRef.current[peer];

        if (stream) {
          try { stream.removeTrack(track); } catch { /* already gone */ }
          if (stream.getTracks().length === 0) {
            if (isScreen) {
              setRemoteScreenStreams((prev) => { const n = { ...prev }; delete n[peer]; return n; });
              delete remoteScreenStreamsRef.current[peer];
              delete syntheticStreamsRef.current[`screen:${peer}`];
            } else {
              setRemoteStreams((prev) => { const n = { ...prev }; delete n[peer]; return n; });
              delete remoteStreamsRef.current[peer];
              delete syntheticStreamsRef.current[peer];
            }
          }
        }
      };

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        if (state === 'failed' || state === 'disconnected') {
          console.warn(`[${classname}] ICE to "${peer}" is ${state}`);
        }
      };

      pc.onnegotiationneeded = async () => {
        // @ts-ignore
        if (!pc._hasNegotiated) return; // skip — initial negotiation handled by makeOffer
        if (pc.signalingState !== 'stable') return; // previous exchange in progress
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendWsMessage('send_offer', {
            target: peer,
            sdp: pc.localDescription?.toJSON?.() || pc.localDescription,
          });
        } catch (err) {
          console.warn(`Renegotiation to "${peer}" failed:`, err);
        }
      };

      // Add existing local tracks (camera/mic)
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track: any) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }
      // If screen sharing is already active, also send the screen stream
      // to this newly-joined peer (so late joiners see the screen too).
      if (screenStreamRef.current && isScreenSharingRef.current) {
        const screenTracks = screenStreamRef.current.getVideoTracks();
        screenTracks.forEach((track: any) => {
          const sender = pc.addTrack(track, screenStreamRef.current);
          if (!screenSendersRef.current[peer]) screenSendersRef.current[peer] = [];
          screenSendersRef.current[peer].push(sender);
        });
      }

      return pc;
    };

    const makeOffer = async (peer: string) => {
      if (!localStreamRef.current) {
        console.warn('makeOffer: local stream not ready');
        return;
      }
      const pc = createPeerConnection(peer);
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        // @ts-ignore
        pc._hasNegotiated = true;
        sendWsMessage('send_offer', {
          target: peer,
          sdp: pc.localDescription?.toJSON?.() || pc.localDescription,
        });
      } catch (err) {
        console.error('makeOffer failed:', err);
      }
    };

    const renegotiateAll = async (peerFilter?: string) => {
      const peers = Object.keys(peerConnections.current);
      for (const peer of peers) {
        if (peerFilter && peer !== peerFilter) continue;
        const pc = peerConnections.current[peer];
        if (!pc || pc.signalingState !== 'stable') continue;
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendWsMessage('send_offer', {
            target: peer,
            sdp: pc.localDescription?.toJSON?.() || pc.localDescription,
          });
        } catch (err) {
          console.warn(`Renegotiation to "${peer}" failed:`, err);
        }
      }
    };

    const handleRemoteOffer = async ({ sender, sdp }: { sender: string; sdp: any }) => {
      if (!localStreamRef.current) {
        pendingOffersRef.current.push({ sender, sdp });
        console.log(`Offer from "${sender}" queued — local stream not ready`);
        return;
      }
      const pc = createPeerConnection(sender);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        // @ts-ignore
        pc._hasNegotiated = true;
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendWsMessage('send_answer', {
          target: sender,
          sdp: pc.localDescription?.toJSON?.() || pc.localDescription,
        });
      } catch (err: any) {
        console.error(`Offer from "${sender}" failed:`, err?.message || err);
      }
    };

    const handleRemoteAnswer = async ({ sender, sdp }: { sender: string; sdp: any }) => {
      const pc = peerConnections.current[sender];
      if (!pc) return;
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        // @ts-ignore
        pc._hasNegotiated = true;
      } catch (err: any) {
        console.error(`Answer from "${sender}" failed:`, err?.message || err);
      }
    };

    const handleIceCandidate = ({ sender, candidate }: { sender: string; candidate: any }) => {
      const pc = peerConnections.current[sender];
      if (!pc || !candidate) return;
      pc.addIceCandidate(new RTCIceCandidate(candidate)).catch((err: any) => {
        console.warn(`addIceCandidate for "${sender}" failed:`, err?.message || err);
      });
    };

    const cleanupPeer = (peer: string) => {
      const pc = peerConnections.current[peer];
      if (pc) { pc.close(); delete peerConnections.current[peer]; }
      setRemoteStreams((prev) => { const n = { ...prev }; delete n[peer]; delete remoteStreamsRef.current[peer]; delete syntheticStreamsRef.current[peer]; return n; });
      setRemoteScreenStreams((prev) => { const n = { ...prev }; delete n[peer]; delete remoteScreenStreamsRef.current[peer]; delete syntheticStreamsRef.current[`screen:${peer}`]; return n; });
      setJoinedUsers((users) => users.filter((u) => u !== peer));
      delete screenSendersRef.current[peer];
    };

    const requestMediaPermissions = async (): Promise<boolean> => {
      if (!(Platform.OS === 'android')) return true;
      const { PermissionsAndroid } = require('react-native');
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      return (
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED
      );
    };

        const acquireScreenStream = async (): Promise<boolean> => {
      if (!isWeb) {
        setScreenShareDeniedMsg('Screen sharing is only available on web browsers.');
        setTimeout(() => setScreenShareDeniedMsg(null), 4000);
        return false;
      }
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setScreenShareDeniedMsg(
          'Screen sharing requires a secure connection (HTTPS or localhost).'
        );
        setTimeout(() => setScreenShareDeniedMsg(null), 5000);
        return false;
      }
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
        setScreenShareDeniedMsg('Screen sharing is not supported in this browser.');
        setTimeout(() => setScreenShareDeniedMsg(null), 4000);
        return false;
      }
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        screenStreamRef.current = screenStream;
        screenTracksPublishedRef.current = false;
        setLocalScreenStream(screenStream);
        const videoTracks = screenStream.getVideoTracks();
        videoTracks.forEach((track: any) => {
          track.addEventListener('ended', () => {
            if (screenStreamRef.current === screenStream) {
              sendWsMessage('request_screen_share', { enable: false });
            }
          });
        });
        return true;
      } catch (err: any) {
        const errorCode = err?.name;
        let message: string;
        if (errorCode === 'NotAllowedError') {
          message = 'Screen sharing permission denied. Please allow it in your browser settings.';
        } else if (errorCode === 'NotSupportedError') {
          message =
            'Screen sharing is not supported in this browser or context. ' +
            'Please use Chrome, Firefox, or Edge on desktop over HTTPS.';
        } else {
          message = 'Could not start screen sharing. Please try again.';
        }
        setScreenShareDeniedMsg(message);
        setScreenSharePending(false);
        screenSharePendingRef.current = false;
        setTimeout(() => setScreenShareDeniedMsg(null), 5000);
        return false;
      }
    };

    const publishScreenTracks = () => {
      if (!screenStreamRef.current) return;
      if (screenTracksPublishedRef.current) return;
      screenSendersRef.current = {};
      const videoTracks = screenStreamRef.current.getVideoTracks();
      Object.entries(peerConnections.current).forEach(([peer, pc]: [string, any]) => {
        videoTracks.forEach((track: any) => {
          const sender = pc.addTrack(track, screenStreamRef.current);
          if (!screenSendersRef.current[peer]) screenSendersRef.current[peer] = [];
          screenSendersRef.current[peer].push(sender);
        });
      });
      screenTracksPublishedRef.current = true;
      setIsScreenSharing(true);
      isScreenSharingRef.current = true;
      // Explicitly renegotiate so peers receive the new screen track.
      renegotiateAll();
    };

    const startScreenCapture = async (): Promise<boolean> => {
      const ok = await acquireScreenStream();
      if (!ok) return false;
      publishScreenTracks();
            return true;
    };

    const stopScreenCapture = () => {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track: any) => track.stop());
      }
      Object.entries(screenSendersRef.current).forEach(([peer, senders]) => {
        const pc = peerConnections.current[peer];
        if (!pc) return;
        senders.forEach((sender) => {
          try { pc.removeTrack(sender); } catch (err) { console.warn('Could not remove sender:', err); }
        });
      });
            screenSendersRef.current = {};
      screenStreamRef.current = null;
      screenTracksPublishedRef.current = false;
      setLocalScreenStream(null);
      setIsScreenSharing(false);
      isScreenSharingRef.current = false;
      // Renegotiate so peers fire onremovetrack and hide the screen.
      renegotiateAll();
    };

    const setupDevice = async () => {
      setConnectionState('connecting');
      try {
        const hasPermission = await requestMediaPermissions();
        if (!hasPermission) {
          setError({ code: 'PERMISSION_DENIED', message: 'Camera or microphone permission was denied' });
          setConnectionState('error');
          return;
        }
        const constraints: any = { audio: true, video: true };
        if (!isWeb && cameraDirectionRef.current === 'back') {
          constraints.video = { facingMode: 'environment' };
        }
        const stream = isWeb
          ? await navigator.mediaDevices.getUserMedia(constraints)
          : await mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;
        setLocalStream(stream);
        setConnectionState('connected');
        if (isWeb && localVideoRef.current) {
          (localVideoRef.current as any).srcObject = stream;
          (localVideoRef.current as any).muted = true;
        }
        // Process queued offers
        const queued = pendingOffersRef.current.splice(0);
        for (const { sender, sdp } of queued) {
          await handleRemoteOffer({ sender, sdp });
        }
        sendWsMessage('join', {});
      } catch (err: any) {
        console.error('Failed to get local media:', err);
        setError({ code: 'MEDIA_ERROR', message: err?.message || 'Could not access camera or microphone' });
        setConnectionState('error');
      }
    };

    const cleanupCall = () => {
      Object.keys(peerConnections.current).forEach((peer) => {
        peerConnections.current[peer]?.close();
        delete peerConnections.current[peer];
      });
      setRemoteStreams({});
      setRemoteScreenStreams({});
      setJoinedUsers([]);
      remoteStreamsRef.current = {};
      remoteScreenStreamsRef.current = {};
      syntheticStreamsRef.current = {};
      pendingOffersRef.current = [];
      stopScreenCapture();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track: any) => track.stop());
        localStreamRef.current = null;
      }
      setLocalStream(null);
      wsRef.current?.close();
      wsRef.current = null;
      setConnectionState('idle');
      setSignallingConnected(false);
      setReconnecting(false);
      setReconnectAttempt(0);
      setError(null);
            isScreenSharingRef.current = false;
      activeScreenSharerRef.current = null;
      setScreenSharePending(false);
      screenSharePendingRef.current = false;
      setScreenShareRequest(null);
      screenShareRequestRef.current = null;
            chatTargetRef.current = null;
      screenTracksPublishedRef.current = false;
    };

    // Expose internal actions
        actionsRef.current = { startScreenCapture, acquireScreenStream, stopScreenCapture, cleanupCall, renegotiateAll };

    /* === Signaling client wiring === */
    const client = new SignalingClient(signalingUrl, {
      classname,
      username: currentUser,
      role: role ?? 'student',
    });
    wsRef.current = client;
    setConnectionState('connecting');

    client.on('open', () => {
      setConnectionState('connected');
      setSignallingConnected(true);
      setReconnecting(false);
      setReconnectAttempt(0);
      setError(null);
      setupDevice();
    });

    client.on('reconnecting', ({ attempt }: any) => {
      setReconnecting(true);
      setReconnectAttempt(attempt);
      setConnectionState('reconnecting');
    });

    client.on('close', () => {
      setSignallingConnected(false);
      if (connectionState !== 'error') {
        setConnectionState('disconnected');
      }
    });

    client.on('error', (err: any) => {
      console.error('Signaling client error:', err);
      setError({ code: 'SIGNALING_ERROR', message: 'Signaling server connection failed' });
      setConnectionState('error');
    });

    client.on('joined', (users: string[]) => {
      const userList = Array.isArray(users) ? users : [];
      setJoinedUsers(userList);
      // Process queued offers
      const queued = pendingOffersRef.current.splice(0);
      queued.forEach(({ sender, sdp }) => { handleRemoteOffer({ sender, sdp }); });
      // Make offers to all existing participants.
      // Use "polite peer" pattern: only the user with the alphabetically
      // smaller username makes the offer. This prevents glare when both
      // users join simultaneously.
      userList.forEach((otherUser) => {
        if (otherUser !== currentUser && currentUser < otherUser) {
          makeOffer(otherUser);
        }
      });
    });

    client.on('user_joined', (body: any) => {
      const newUser = body?.username;
      if (typeof newUser === 'string' && newUser !== currentUser) {
        setJoinedUsers((users) => [...users.filter((u) => u !== newUser), newUser]);
        // Only make an offer if we are the "polite" peer (alphabetically smaller)
        if (currentUser < newUser) {
          makeOffer(newUser);
        }
      }
    });

    client.on('peer_left', (body: any) => {
      const leftUser = body?.username;
      if (typeof leftUser === 'string') cleanupPeer(leftUser);
    });

    client.on('offer_sdp_received', (body: any) => {
      handleRemoteOffer({ sender: body.sender, sdp: body.sdp });
    });

    client.on('answer_sdp_received', (body: any) => {
      handleRemoteAnswer({ sender: body.sender, sdp: body.sdp });
    });

    client.on('ice_candidate_received', (body: any) => {
      handleIceCandidate({ sender: body.sender, candidate: body.candidate });
    });

                client.on('screen_share_state', (body: any) => {
      const nextActive = Boolean(body?.active);
      const nextSharer = typeof body?.username === 'string' ? body.username : null;
      setActiveScreenSharer(nextActive ? nextSharer : null);
      activeScreenSharerRef.current = nextActive ? nextSharer : null;
      setIsScreenSharing(nextActive && nextSharer === currentUser);
      isScreenSharingRef.current = nextActive && nextSharer === currentUser;
      // A screen-share-state broadcast means the request was resolved (granted/denied)
      // by the server, so clear any pending-approval flag.
      if (screenSharePendingRef.current) {
        setScreenSharePending(false);
        screenSharePendingRef.current = false;
      }
      if (!nextActive) {
        setScreenShareDeniedMsg(null);
        if (screenStreamRef.current) stopScreenCapture();
      } else if (nextSharer === currentUser) {
        if (!screenStreamRef.current) {
          // Fallback: stream wasn't acquired from a user-gesture context
          // (e.g. reconnection). Try again — may fail in browsers that
          // require a user gesture, but that's the best we can do.
          startScreenCapture();
        } else if (!screenTracksPublishedRef.current) {
          // Stream was already acquired from the button-click user gesture
          // (student flow) — now that the server granted it, publish tracks
          // to all peer connections.
          publishScreenTracks();
        }
      }
    });

          client.on('screen_share_denied', (body: any) => {
      const reason = typeof body?.reason === 'string' ? body.reason : null;
      // The request was denied — clear the pending flag so the UI updates.
      if (screenSharePendingRef.current) {
        setScreenSharePending(false);
        screenSharePendingRef.current = false;
      }
      // Stop any local capture we may have started from the button click.
      if (screenStreamRef.current) {
        stopScreenCapture();
        // Notify the server so it knows the share is no longer active.
        sendWsMessage('request_screen_share', { enable: false });
      }
      if (reason) {
        setScreenShareDeniedMsg(reason);
        setTimeout(() => setScreenShareDeniedMsg(null), 4000);
      }
    });

    // Teacher-side: a student is asking for permission to screen-share.
    client.on('screen_share_request', (body: any) => {
      const requester = body?.username;
      if (typeof requester === 'string' && role === 'teacher') {
        setScreenShareRequest(requester);
        screenShareRequestRef.current = requester;
      }
    });

    // Student-side: teacher responded to the permission request.
    client.on('screen_share_grant', (body: any) => {
      const { granted, reason } = body;
      // The teacher either approved (server → screen_share_state) or rejected
      // (server → screen_share_denied).  Clear the pending flag here.
      if (screenSharePendingRef.current) {
        setScreenSharePending(false);
        screenSharePendingRef.current = false;
      }
      if (!granted && reason) {
        setScreenShareDeniedMsg(reason);
        setTimeout(() => setScreenShareDeniedMsg(null), 4000);
      }
    });

    client.on('hand_raise_state', (body: any) => {
      const hands = Array.isArray(body?.raisedHands) ? body.raisedHands : [];
      setRaisedHands(hands);
      setIsHandRaised(hands.includes(currentUser));
      isHandRaisedRef.current = hands.includes(currentUser);
    });

    client.on('chat_message_received', (body: any) => {
      const sender = body?.sender;
      const message = body?.message;
      if (typeof sender === 'string' && typeof message === 'string') {
        setChatMessages((prev) => {
          const next = { ...prev };
          const existing = next[sender] ?? [];
          next[sender] = [...existing, { sender, text: message, timestamp: Date.now() }];
          return next;
        });
        if (sender !== chatTargetRef.current) {
          setUnreadCounts((prev) => {
            const next = { ...prev, [sender]: (prev[sender] ?? 0) + 1 };
            setTotalUnread(Object.values(next).reduce((s, c) => s + c, 0));
            return next;
          });
        }
      }
    });

    client.on('pong', () => { /* keep-alive confirmed */ });

    client.connect();

    // Cleanup on unmount
    return () => {
      client.close();
      cleanupCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount


  return {
    classname,
    currentUser,
    localStream,
    remoteStreams,
    remoteScreenStreams,
    localVideoRef,
    remoteVideoRefs,
    connectionState,
    signallingConnected,
    signallingStateLabel,
    reconnecting,
    reconnectAttempt,
    error,
    screenShareDeniedMsg,
    joinedUsers,
    activeScreenSharer,
    raisedHands,
    isHandRaised,
    isMuted,
    isCameraOff,
    isScreenSharing,
    localScreenStream,
    cameraDirection,
        screenShareAvailable,
    screenSharePending,
    screenShareRequest,
    totalUnread,
    chatTarget,
    chatMessages,
    unreadCounts,
    isParticipantsVisible,
    toggleMute,
    toggleCamera,
    switchCamera,
        toggleScreenShare,
    grantScreenShare,
    denyScreenShare,
    toggleHandRaise,
    endCall,
    openParticipants,
    closeParticipants,
    selectUserForChat,
    closeChat,
    sendChatMessage,
    retryConnection,
    RTCView,
    isWeb,
  };
}
