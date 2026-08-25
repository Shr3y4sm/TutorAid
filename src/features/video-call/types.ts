/**
 * Shared TypeScript types for the TutorAid video-calling feature.
 *
 * These types are platform-agnostic (work on web, iOS, and Android).
 */

// ---------------------------------------------------------------------------
// PeerConnection primitives
// On web the browser provides RTCPeerConnection / RTCSessionDescription /
// RTCIceCandidate / MediaStream as globals.  On native (React Native) they
// come from `react-native-webrtc`.  We use `any` here and cast at the call
// sites so that a single hook implementation can target both environments.
// ---------------------------------------------------------------------------

/** A serialised SDP description, e.g. { type: "offer", sdp: "..." }. */
export type SDP = RTCSessionDescriptionInit;

/** An ICE candidate object. */
export type ICECandidate = RTCIceCandidateInit;

/** A WebRTC MediaStream (browser or react-native-webrtc). */
export type AnyMediaStream = any;

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

/** The JSON envelope every message sent over the signalling socket uses. */
export interface SignalingMessage<T = any> {
  type: string;
  body: T;
}

/** Body of the `joined` message — array of existing usernames. */
export interface JoinedBody {
  users: string[];
}

/** Body of the `offer_sdp_received` / `answer_sdp_received` messages. */
export interface SdpMessage {
  sender: string;
  sdp: SDP;
}

/** Body of the `ice_candidate_received` message. */
export interface IceMessage {
  sender: string;
  candidate: ICECandidate;
}

/** Body of the `screen_share_state` message. */
export interface ScreenShareStateBody {
  active: boolean;
  username: string | null;
}

/** Body of the `screen_share_denied` message. */
export interface ScreenShareDeniedBody {
  active: boolean;
  username?: string | null;
  reason?: string;
}

/** Body of the `screen_share_request` message (server → teacher only). */
export interface ScreenShareRequestBody {
  username: string; // the student requesting permission
}

/** Body of the `screen_share_grant` message (teacher → server). */
export interface ScreenShareGrantBody {
  target: string;
  granted: boolean;
  reason?: string;
}

/** Body of the `hand_raise_state` message. */
export interface HandRaiseStateBody {
  raisedHands: string[];
}

/** Body of the `user_joined` and `peer_left` messages. */
export interface UserEventBody {
  username: string;
}

/** Body of the `chat_message_received` message. */
export interface ChatMessageBody {
  sender: string;
  message: string;
}

// ---------------------------------------------------------------------------
// UI state
// ---------------------------------------------------------------------------

/** High-level connection lifecycle state. */
export type ConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

/** A structured error shown in the UI. */
export interface VideoCallError {
  code: string;
  message: string;
}

/** A single chat message rendered in the chat panel. */
export interface ChatMessage {
  sender: string;
  text: string;
  timestamp: number;
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface VideoTileProps {
  /** The media stream to render. */
  stream: AnyMediaStream;
  /** Display label beneath the tile. */
  label: string;
  /** Whether this is the local (self) tile. */
  isLocal?: boolean;
  /** Whether the participant has raised their hand. */
  handRaised?: boolean;
  /** Optional mirror flag for the local tile. */
  mirror?: boolean;
  /** Optional aspect ratio / size variant. */
  variant?: 'regular' | 'screen';
}

export interface ControlsBarProps {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
    screenShareAvailable: boolean;
  screenShareDisabledByPeer: boolean;
  /** A student's request is awaiting teacher approval. */
  screenSharePending: boolean;
  unreadCount: number;
  onMute: () => void;
  onCamera: () => void;
  onScreenShare: () => void;
  onHandRaise: () => void;
  onParticipants: () => void;
  onEndCall: () => void;
  onSwitchCamera?: () => void;
  cameraDirection?: 'front' | 'back';
}

export interface ParticipantsModalProps {
  visible: boolean;
  users: string[];
  currentUser: string;
  selectedUser: string | null;
  unreadCounts: Record<string, number>;
  raisedHands: string[];
  chatMessages: Record<string, ChatMessage[]>;
  currentUserAvatarSeed?: string;
  onSelectUser: (username: string) => void;
  onSendChat: (message: string) => void;
  onClose: () => void;
}

export interface ChatPanelProps {
  currentUser: string;
  targetUser: string | null;
  messages: ChatMessage[];
  onSend: (message: string) => void;
}
