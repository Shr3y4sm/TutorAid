/**
 * VideoTile
 * ---------
 * Renders a single media stream.
 *  - On web:  a native <video> element (srcObject set via ref)
 *  - On native: react-native-webrtc RTCView
 */
import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { VideoTileProps } from '../types';

export const VideoTile: React.FC<VideoTileProps> = ({
  stream,
  label,
  isLocal = false,
  handRaised = false,
  mirror = false,
  variant = 'regular',
}) => {
  const videoRef = useRef<any>(null);

  // On web, attach the stream to the <video> element
  useEffect(() => {
    if (Platform.OS === 'web' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const tileStyle = [
    styles.tile,
    isLocal && styles.localTile,
    handRaised && styles.raisedHandBorder,
    variant === 'screen' && styles.screenTile,
    mirror && styles.mirrored,
  ];

  const videoStyle =
    variant === 'screen' ? styles.screenVideo : styles.regularVideo;

  if (Platform.OS === 'web') {
    return (
      <View style={tileStyle}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          style={videoStyle}
        />
        <View style={styles.tileLabel}>
          <Text style={styles.tileLabelText}>
            {label}
            {handRaised ? ' ✋' : ''}
          </Text>
        </View>
      </View>
    );
  }

  // Native (React Native + react-native-webrtc)
  const { RTCView } = require('react-native-webrtc');
  return (
    <View style={tileStyle}>
      <RTCView
        streamURL={stream ? (stream as any).toURL?.() || '' : ''}
        style={videoStyle}
        objectFit="cover"
        mirror={isLocal && mirror}
      />
      <View style={styles.tileLabel}>
        <Text style={styles.tileLabelText}>
          {label}
          {handRaised ? ' ✋' : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
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
    aspectRatio: 16 / 9,
    maxWidth: 720,
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
  regularVideo: {
    width: 160,
    height: 120,
    backgroundColor: '#1A1D24',
  },
  screenVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A1D24',
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
});
