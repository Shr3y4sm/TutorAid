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
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useVideoCall } from './useVideoCall';
import { VideoTile } from './components/VideoTile';
import { ControlsBar } from './components/ControlsBar';
import { ParticipantsModal } from './components/ParticipantsModal';
import { StatusHeader } from './components/StatusHeader';

export interface VideoCallScreenProps {
  classname: string;
  username: string;
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
  serverUrl,
  iceServers,
  autoJoin = true,
}) => {
  const v = useVideoCall({ classname, username, serverUrl, iceServers, autoJoin });

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

          <ControlsBar
            isMuted={v.isMuted}
            isCameraOff={v.isCameraOff}
            isScreenSharing={v.isScreenSharing}
            isHandRaised={v.isHandRaised}
            screenShareAvailable={v.screenShareAvailable}
            screenShareDisabledByPeer={Boolean(
              v.activeScreenSharer && v.activeScreenSharer !== v.currentUser
            )}
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
                styles.videoTile,
                v.raisedHands.includes(peer) && styles.raisedHandBorder,
              ]}
            >
              <video
                autoPlay
                playsInline
                style={styles.webVideo}
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
              styles.videoTile,
              styles.localTile,
              v.isHandRaised && styles.raisedHandBorder,
            ]}
          >
            <video
              ref={v.localVideoRef}
              autoPlay
              playsInline
              muted
              style={styles.webVideo}
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

        <ControlsBar
          isMuted={v.isMuted}
          isCameraOff={v.isCameraOff}
          isScreenSharing={v.isScreenSharing}
          isHandRaised={v.isHandRaised}
          screenShareAvailable={v.screenShareAvailable}
          screenShareDisabledByPeer={Boolean(
            v.activeScreenSharer && v.activeScreenSharer !== v.currentUser
          )}
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
  screenVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
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
});
