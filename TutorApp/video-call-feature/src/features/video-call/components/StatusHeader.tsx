/**
 * StatusHeader
 * ------------
 * Top bar showing the room/class name, a connection-state indicator,
 * and any toast messages (screen-share denied, etc.).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface StatusHeaderProps {
  classname: string;
  signallingStateLabel: string;
  signallingConnected: boolean;
  reconnecting: boolean;
  reconnectAttempt: number;
  screenShareDeniedMsg: string | null;
}

export const StatusHeader: React.FC<StatusHeaderProps> = ({
  classname,
  signallingStateLabel,
  signallingConnected,
  reconnecting,
  reconnectAttempt,
  screenShareDeniedMsg,
}) => {
  return (
    <>
      <View style={styles.roomHeader}>
        <Text style={styles.roomName}>Room: {classname}</Text>
        <View
          style={[
            styles.statusDot,
            signallingConnected ? styles.statusConnected : styles.statusDisconnected,
            reconnecting && styles.statusReconnecting,
          ]}
        />
        <Text style={styles.statusText}>{signallingStateLabel}</Text>
      </View>

      {screenShareDeniedMsg ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{screenShareDeniedMsg}</Text>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1A1D24',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  roomName: {
    color: '#E8EAED',
    fontWeight: '600',
    fontSize: 14,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusConnected: {
    backgroundColor: '#0EC877',
  },
  statusDisconnected: {
    backgroundColor: '#F03F05',
  },
  statusReconnecting: {
    backgroundColor: '#FFD700',
  },
  statusText: {
    color: '#E8EAED',
    fontSize: 12,
    opacity: 0.8,
  },
  toast: {
    position: 'absolute',
    top: 60,
    left: '50%',
    transform: [{ translateX: -150 }],
    width: 300,
    backgroundColor: '#F03F05',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    zIndex: 100,
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
