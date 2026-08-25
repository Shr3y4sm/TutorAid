/**
 * VideoCallScreen
 * ---------------
 * The main video-calling screen.
 *
 * Usage (Expo Router route):
 *   <VideoCallScreen classname="ABC123" username="alice" />
 *
 * Or with a custom server:
 *   <VideoCallScreen classname="ABC123" username="alice" serverUrl="wss://your-server.com/ws" />
 *
 * The component handles everything: WebRTC, signalling, reconnection,
 * screen sharing, chat, hand raising, and UI.
 */
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { joinMeeting, endMeeting } from '@/api/meetings';
import { useVideoCall } from './useVideoCall';
import { VideoTile } from './components/VideoTile';
import { ControlsBar } from './components/ControlsBar';
import { ParticipantsModal } from './components/ParticipantsModal';
import { StatusHeader } from './components/StatusHeader';

export interface VideoCallScreenProps {
  classname: string;
  username: string;
  /** "teacher" or "student" — determines whether ending the call marks attendance. */
  role?: "teacher" | "student";
  /** The teacher or student id (used for meeting start/join/end API calls). */
  entityId?: string;
  /** Override the signalling server URL. */
  serverUrl?: string;
  /** Override / add ICE servers (e.g. TURN). */
  iceServers?: any[];
  /** Auto-join the room on mount. */
  autoJoin?: boolean;
}

export const VideoCallScreen: React.FC<VideoCallScreenProps> = ({
  classname,
  username,
  role,
  entityId,
  serverUrl,
  iceServers,
  autoJoin = true,
}) => {
    const v = useVideoCall({ classname, username, role, serverUrl, iceServers, autoJoin });

  // Guard so join/end API calls fire exactly once per mount.
  const joinedRef = useRef(false);
  const endedRef = useRef(false);

  // ---- Students: record their join so they get auto-marked Present ----
  useEffect(() => {
    if (role !== 'student' || !entityId || joinedRef.current) return;
    joinedRef.current = true;
    joinMeeting({ meet_code: classname, student_id: entityId }).catch((err) => {
      console.warn('Failed to record meeting join:', err);
    });
  }, [role, entityId, classname]);

  // ---- Set local video srcObject when stream becomes available (web) ----
  useEffect(() => {
    if (v.isWeb && v.localStream && v.localVideoRef.current) {
      v.localVideoRef.current.srcObject = v.localStream;
      v.localVideoRef.current.muted = true;
    }
  }, [v.localStream, v.isWeb]);

  // ---- End call: cleanup + navigate back ----
  const handleEndCall = () => {
    v.endCall();

    // Teachers: end the meeting session and auto-mark attendance as
    // Present for every student who joined. Non-joiners are untouched.
    if (role === 'teacher' && entityId && !endedRef.current) {
      endedRef.current = true;
      endMeeting({ meet_code: classname, teacher_id: entityId })
        .then((result) => {
          console.log(
            `Meeting ${result.meet_code} ended — ${result.attendance_marked} student(s) marked Present.`
          );
        })
        .catch((err) => {
          console.warn('Failed to end meeting / mark attendance:', err);
        });
    }

    // Navigate back to the previous screen (dashboard/home)
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }, 300);
  };

  // ---- Error overlay ----
  if (v.error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMsg}>{v.error.message}</Text>
          <Text style={styles.errorCode}>{v.error.code}</Text>
          {v.connectionState === 'error' && (
            <Text style={styles.retryHint} onPress={v.retryConnection}>
              Tap to retry
            </Text>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ---- Loading state (waiting for camera/mic) ----
  if (v.connectionState === 'connecting' || v.connectionState === 'idle') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerBox}>
          <Text style={styles.loadingText}>
            {v.connectionState === 'connecting' ? 'Connecting…' : 'Getting ready…'}
          </Text>
          <Text style={styles.hint}>
            {v.connectionState === 'connecting'
              ? `Signaling: ${v.signallingStateLabel}`
              : 'Requesting camera and microphone access…'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { RTCView } = v;

    // ---- Native render (uses RTCView + ScrollView) ----
  if (!v.isWeb) {
    const hasActiveScreenShare = Boolean(v.activeScreenSharer);
    const isLocalSharer = v.activeScreenSharer === v.currentUser;
    const remoteEntry = Object.entries(v.remoteScreenStreams)[0] as
      | [string, any]
      | undefined;
    const mainScreenStream = isLocalSharer
      ? v.localScreenStream
      : remoteEntry?.[1];
    const mainScreenLabel = isLocalSharer
      ? `${v.currentUser} (You)`
      : remoteEntry?.[0];
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <StatusHeader
            classname={v.classname}
            signallingStateLabel={v.signallingStateLabel}
            signallingConnected={v.signallingConnected}
            reconnecting={v.reconnecting}
            reconnectAttempt={v.reconnectAttempt}
            screenShareDeniedMsg={v.screenShareDeniedMsg}
          />

                    {hasActiveScreenShare ? (
            // ── Spotlight mode (Google Meet style) ──
            <View style={styles.spotlightContainer}>
              {/* Main screen-share tile */}
              {mainScreenStream && (
                <View key="spotlight-main" style={styles.spotlightMain}>
                  <VideoTile
                    stream={mainScreenStream}
                    label={`${mainScreenLabel} • Sharing screen`}
                    variant="screen"
                    handRaised={false}
                  />
                </View>
              )}

              {/* PiP overlay container (top-right) */}
              <View style={styles.pipStack}>
                {Object.entries(v.remoteStreams).map(([peer, stream], idx) => (
                  <View
                    key={peer}
                    style={[
                      styles.pipTileNative,
                      idx === 0 && styles.pipTileNativeFirst,
                    ]}
                  >
                    <VideoTile
                      stream={stream}
                      label={peer}
                      handRaised={v.raisedHands.includes(peer)}
                    />
                  </View>
                ))}
              </View>

              {/* Local tile (bottom-right PiP) */}
              <View
                style={[
                  styles.pipTileNative,
                  styles.localPipNative,
                  v.isHandRaised && styles.raisedHandBorder,
                ]}
              >
                <VideoTile
                  stream={v.localStream}
                  label={`${v.currentUser} (You)${v.isHandRaised ? ' ✋' : ''}`}
                  isLocal
                  mirror
                  handRaised={v.isHandRaised}
                />
              </View>
            </View>
          ) : (
            <ScrollView
              style={styles.videoScroll}
              contentContainerStyle={styles.videoArea}
            >
              {/* Screen-share tiles (rendered first, full-width) */}
            {Object.entries(v.remoteScreenStreams).map(([peer, stream]) => (
              <VideoTile
                key={`screen-${peer}`}
                stream={stream}
                label={`${peer} • Sharing screen`}
                variant="screen"
                handRaised={v.raisedHands.includes(peer)}
              />
            ))}

            {/* Remote video tiles */}
            {Object.entries(v.remoteStreams).map(([peer, stream]) => (
              <VideoTile
                key={peer}
                stream={stream}
                label={peer}
                handRaised={v.raisedHands.includes(peer)}
              />
            ))}

            {/* Local tile */}
            <VideoTile
              stream={v.localStream}
              label={`${v.currentUser} (You)${v.isHandRaised ? ' ✋' : ''}`}
              isLocal
              mirror
              handRaised={v.isHandRaised}
            />

            {/* Empty state */}
            {v.joinedUsers.filter((u) => u !== v.currentUser).length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Waiting for participants…</Text>
                            </View>
            )}
            </ScrollView>
          )}

          {v.screenShareRequest && role === 'teacher' && (
            <View style={styles.permissionBanner}>
              <Text style={styles.permissionBannerText}>
                {v.screenShareRequest} wants to share their screen
              </Text>
              <View style={styles.permissionBannerButtons}>
                <Pressable
                  style={[styles.permissionBannerBtn, styles.permissionBannerBtnDeny]}
                  onPress={() => v.denyScreenShare(v.screenShareRequest!)}
                >
                  <Text style={styles.permissionBannerBtnText}>Deny</Text>
                </Pressable>
                <Pressable
                  style={[styles.permissionBannerBtn, styles.permissionBannerBtnApprove]}
                  onPress={() => v.grantScreenShare(v.screenShareRequest!)}
                >
                  <Text style={styles.permissionBannerBtnText}>Approve</Text>
                </Pressable>
              </View>
            </View>
          )}

          <ControlsBar
            isMuted={v.isMuted}
            isCameraOff={v.isCameraOff}
            isScreenSharing={v.isScreenSharing}
            isHandRaised={v.isHandRaised}
            screenShareAvailable={v.screenShareAvailable}
            screenShareDisabledByPeer={Boolean(
              v.activeScreenSharer && v.activeScreenSharer !== v.currentUser
            )}
            screenSharePending={v.screenSharePending}
            unreadCount={v.totalUnread}
            onMute={v.toggleMute}
            onCamera={v.toggleCamera}
            onScreenShare={v.toggleScreenShare}
            onHandRaise={v.toggleHandRaise}
            onParticipants={v.openParticipants}
            onEndCall={handleEndCall}
            onSwitchCamera={v.switchCamera}
            cameraDirection={v.cameraDirection}
          />

          <ParticipantsModal
            visible={v.isParticipantsVisible}
            users={v.joinedUsers}
            currentUser={v.currentUser}
            selectedUser={v.chatTarget}
            unreadCounts={v.unreadCounts}
            raisedHands={v.raisedHands}
            chatMessages={v.chatMessages}
            onSendChat={v.sendChatMessage}
            onSelectUser={v.selectUserForChat}
            onClose={v.closeParticipants}
          />
        </View>
      </SafeAreaView>
    );
  }

    // ---- Web render (uses <video> elements) ----
  const hasActiveScreenShare = Boolean(v.activeScreenSharer);
  // Determine who is sharing and which stream to spotlight.
  const isLocalSharer = v.activeScreenSharer === v.currentUser;
  const remoteEntry = Object.entries(v.remoteScreenStreams)[0] as
    | [string, any]
    | undefined;
  const mainScreenStream = isLocalSharer
    ? v.localScreenStream
    : remoteEntry?.[1];
  const mainScreenLabel = isLocalSharer
    ? `${v.currentUser} (You)`
    : remoteEntry?.[0];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <StatusHeader
          classname={v.classname}
          signallingStateLabel={v.signallingStateLabel}
          signallingConnected={v.signallingConnected}
          reconnecting={v.reconnecting}
          reconnectAttempt={v.reconnectAttempt}
          screenShareDeniedMsg={v.screenShareDeniedMsg}
        />

        {/* --- Video area: spotlight layout when sharing, grid otherwise --- */}
        {hasActiveScreenShare ? (
          // ── Spotlight mode (Google Meet style) ──
          <View style={styles.spotlightContainer}>
            {/* Main screen-share video */}
            {mainScreenStream && (
              <View key="spotlight-main" style={styles.spotlightMain}>
                <video
                  autoPlay
                  playsInline
                  style={styles.spotlightMainVideo}
                  ref={(element) => {
                    if (element) {
                      element.srcObject = mainScreenStream;
                    }
                  }}
                />
                <View style={styles.tileLabel}>
                  <Text style={styles.tileLabelText}>
                    {mainScreenLabel} • Sharing screen
                  </Text>
                </View>
              </View>
            )}

            {/* PiP overlay container (top-right, stacked vertically) */}
            <View style={styles.pipStack}>
              {Object.entries(v.remoteStreams).map(([peer, stream], idx) => (
                <View
                  key={peer}
                  style={[
                    styles.videoTile,
                    styles.pipTile,
                    idx === 0 && styles.pipTileFirst,
                    v.raisedHands.includes(peer) && styles.raisedHandBorder,
                  ]}
                >
                  <video
                    autoPlay
                    playsInline
                    style={styles.pipVideo}
                    ref={(element) => {
                      v.remoteVideoRefs.current[peer] = element;
                      if (element) {
                        element.srcObject = stream;
                      }
                    }}
                  />
                  <View style={styles.tileLabel}>
                    <Text style={styles.tileLabelText}>
                      {peer}
                      {v.raisedHands.includes(peer) ? ' ✋' : ''}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Local tile (bottom-right PiP) */}
            <View
              style={[
                styles.videoTile,
                styles.localPip,
                v.isHandRaised && styles.raisedHandBorder,
              ]}
            >
              <video
                ref={v.localVideoRef}
                autoPlay
                playsInline
                muted
                style={styles.pipVideo}
              />
              <View style={styles.tileLabel}>
                <Text style={styles.tileLabelText}>
                  {v.currentUser} (You)
                  {v.isHandRaised ? ' ✐' : ''}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          // ── Grid mode (standard) ──
          <ScrollView
            style={styles.videoScroll}
            contentContainerStyle={styles.videoArea}
          >
          {/* Screen-share tiles */}
          {Object.entries(v.remoteScreenStreams).map(([peer, stream]) => (
            <View key={`screen-${peer}`} style={styles.screenTile}>
              <video
                autoPlay
                playsInline
                style={styles.screenVideo}
                ref={(element) => {
                  if (element) {
                    element.srcObject = stream;
                  }
                }}
              />
              <View style={styles.tileLabel}>
                <Text style={styles.tileLabelText}>{peer} • Sharing screen</Text>
              </View>
            </View>
          ))}

          {/* Remote video tiles */}
          {Object.entries(v.remoteStreams).map(([peer, stream]) => (
            <View
              key={peer}
              style={[
                styles.webGridTile,
                v.raisedHands.includes(peer) && styles.raisedHandBorder,
              ]}
            >
              <video
                autoPlay
                playsInline
                style={styles.webFillVideo}
                ref={(element) => {
                  v.remoteVideoRefs.current[peer] = element;
                  if (element) {
                    element.srcObject = stream;
                  }
                }}
              />
              <View style={styles.tileLabel}>
                <Text style={styles.tileLabelText}>
                  {peer}
                  {v.raisedHands.includes(peer) ? ' ✋' : ''}
                </Text>
              </View>
            </View>
          ))}

          {/* Local tile */}
          <View
            style={[
              styles.webGridTile,
              styles.localTile,
              v.isHandRaised && styles.raisedHandBorder,
            ]}
          >
            <video
              ref={v.localVideoRef}
              autoPlay
              playsInline
              muted
              style={styles.webFillVideo}
            />
            <View style={styles.tileLabel}>
              <Text style={styles.tileLabelText}>
                {v.currentUser} (You)
                {v.isHandRaised ? ' ✋' : ''}
              </Text>
            </View>
          </View>

          {v.joinedUsers.filter((u) => u !== v.currentUser).length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Waiting for participants…</Text>
                       </View>
          )}
          </ScrollView>
        )}

        {v.screenShareRequest && role === 'teacher' && (
          <View style={styles.permissionBanner}>
            <Text style={styles.permissionBannerText}>
              {v.screenShareRequest} wants to share their screen
            </Text>
            <View style={styles.permissionBannerButtons}>
              <Pressable
                style={[styles.permissionBannerBtn, styles.permissionBannerBtnDeny]}
                onPress={() => v.denyScreenShare(v.screenShareRequest!)}
              >
                <Text style={styles.permissionBannerBtnText}>Deny</Text>
              </Pressable>
              <Pressable
                style={[styles.permissionBannerBtn, styles.permissionBannerBtnApprove]}
                onPress={() => v.grantScreenShare(v.screenShareRequest!)}
              >
                <Text style={styles.permissionBannerBtnText}>Approve</Text>
              </Pressable>
            </View>
          </View>
        )}

        <ControlsBar
          isMuted={v.isMuted}
          isCameraOff={v.isCameraOff}
          isScreenSharing={v.isScreenSharing}
          isHandRaised={v.isHandRaised}
          screenShareAvailable={v.screenShareAvailable}
          screenShareDisabledByPeer={Boolean(
            v.activeScreenSharer && v.activeScreenSharer !== v.currentUser
          )}
          screenSharePending={v.screenSharePending}
          unreadCount={v.totalUnread}
          onMute={v.toggleMute}
          onCamera={v.toggleCamera}
          onScreenShare={v.toggleScreenShare}
          onHandRaise={v.toggleHandRaise}
          onParticipants={v.openParticipants}
            onEndCall={handleEndCall}
          />

        <ParticipantsModal
          visible={v.isParticipantsVisible}
          users={v.joinedUsers}
          currentUser={v.currentUser}
          selectedUser={v.chatTarget}
          unreadCounts={v.unreadCounts}
          raisedHands={v.raisedHands}
          chatMessages={v.chatMessages}
          onSendChat={v.sendChatMessage}
          onSelectUser={v.selectUserForChat}
          onClose={v.closeParticipants}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0F1115',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F1115',
    paddingVertical: 8,
  },
  videoScroll: {
    flex: 1,
    width: '100%',
  },
  videoArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  videoTile: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#1A1D24',
  },
  localTile: {
    borderColor: '#0EC877',
  },
  raisedHandBorder: {
    borderColor: '#FFD700',
  },
  screenTile: {
    width: '100%',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A1D24',
    aspectRatio: 16 / 9,
    maxWidth: 720,
  },
  webVideo: {
    width: 320,
    height: 200,
    backgroundColor: '#1A1D24',
    objectFit: 'cover',
  },
  webGridTile: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#1A1D24',
    flexGrow: 1,
    flexBasis: 320,
    maxWidth: 480,
    minWidth: 240,
    aspectRatio: 16 / 9,
  },
  webFillVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A1D24',
    objectFit: 'cover',
  },
    screenVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },

  /* ---- Spotlight / Picture-in-Picture styles (Google Meet style) ---- */
  spotlightContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#0F1115',
  },
  spotlightMain: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  spotlightMainVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A1D24',
    objectFit: 'contain',
  },
  pipStack: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'column',
    gap: 8,
    zIndex: 10,
  },
  pipTile: {
    width: 180,
    height: 135,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#1A1D24',
  },
  pipTileFirst: {
    // first tile in the stack sits at the top
  },
  localPip: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 200,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0EC877',
    backgroundColor: '#1A1D24',
    zIndex: 10,
  },
  pipVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A1D24',
    objectFit: 'cover',
  },

  /* ---- Native PiP styles ---- */
  pipTileNative: {
    width: 180,
    height: 135,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#1A1D24',
  },
  pipTileNativeFirst: {
    // position: 'relative' for the stack
    position: 'relative',
  },
  localPipNative: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 200,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0EC877',
    backgroundColor: '#1A1D24',
    zIndex: 10,
  },
  tileLabel: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tileLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#E8EAED',
    fontSize: 20,
    fontWeight: '600',
  },
  hint: {
    color: '#888',
    fontSize: 14,
  },
  errorTitle: {
    color: '#F03F05',
    fontSize: 20,
    fontWeight: '700',
  },
  errorMsg: {
    color: '#E8EAED',
    fontSize: 14,
    textAlign: 'center',
  },
  errorCode: {
    color: '#888',
    fontSize: 12,
  },
    retryHint: {
    color: '#0EC877',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2A2D35',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  permissionBannerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  permissionBannerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  permissionBannerBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  permissionBannerBtnDeny: {
    backgroundColor: '#F03F05',
  },
  permissionBannerBtnApprove: {
    backgroundColor: '#0EC877',
  },
  permissionBannerBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});
