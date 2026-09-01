/**
 * ControlsBar
 * -----------
 * Bottom row of control buttons: participants, mute, camera, screen share,
 * hand raise, switch camera (mobile), and end call.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ControlsBarProps } from '../types';

const CONTROL_BUTTON_SIZE = 56;

export const ControlsBar: React.FC<ControlsBarProps> = ({
  isMuted,
  isCameraOff,
  isScreenSharing,
  isHandRaised,
    screenShareAvailable,
  screenShareDisabledByPeer,
  screenSharePending,
  unreadCount,
  onMute,
  onCamera,
  onScreenShare,
  onHandRaise,
  onParticipants,
  onEndCall,
  onSwitchCamera,
  cameraDirection,
  notesAvailable,
  onNotes,
}) => {
  return (
    <View style={styles.controlsRow}>
      <View style={styles.buttonWithBadge}>
        <Pressable style={styles.controlRoundButton} onPress={onParticipants}>
          <Text style={styles.controlIcon}>👥</Text>
        </Pressable>
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        style={[styles.controlRoundButton, isMuted && styles.activeControlButton]}
        onPress={onMute}
      >
        <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎤'}</Text>
      </Pressable>

      <Pressable
        style={[styles.controlRoundButton, isCameraOff && styles.activeControlButton]}
        onPress={onCamera}
      >
        <Text style={styles.controlIcon}>{isCameraOff ? '🚫' : '📹'}</Text>
      </Pressable>

            {screenShareAvailable && (
        <Pressable
          style={[
            styles.controlRoundButton,
            isScreenSharing && styles.activeControlButton,
            (screenSharePending || screenShareDisabledByPeer) && styles.disabledControlButton,
          ]}
          disabled={Boolean(screenSharePending || screenShareDisabledByPeer)}
          onPress={onScreenShare}
        >
          <Text style={styles.controlIcon}>
            {screenSharePending ? '⏳' : isScreenSharing ? '🖥️' : '💻'}
          </Text>
        </Pressable>
      )}

      <Pressable
        style={[styles.controlRoundButton, isHandRaised && styles.handRaisedButton]}
        onPress={onHandRaise}
      >
        <Text style={styles.controlIcon}>{isHandRaised ? '✋' : '🤚'}</Text>
      </Pressable>

      {onSwitchCamera && (
        <Pressable style={styles.controlRoundButton} onPress={onSwitchCamera}>
          <Text style={styles.controlIcon}>🔄</Text>
        </Pressable>
      )}

      {notesAvailable && onNotes && (
        <Pressable style={styles.controlRoundButton} onPress={onNotes}>
          <Text style={styles.controlIcon}>📝</Text>
        </Pressable>
      )}

      <Pressable style={styles.endButton} onPress={onEndCall}>
        <Text style={styles.endButtonIcon}>📞</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  buttonWithBadge: {
    position: 'relative',
  },
  controlRoundButton: {
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: '#2A2D35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeControlButton: {
    backgroundColor: '#0EC877',
  },
  handRaisedButton: {
    backgroundColor: '#FFD700',
  },
  disabledControlButton: {
    opacity: 0.55,
  },
  controlIcon: {
    fontSize: 24,
  },
  endButton: {
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: '#F03F05',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endButtonIcon: {
    fontSize: 24,
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F03F05',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
