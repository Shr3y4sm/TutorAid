/**
 * TutorAid Video-Calling Feature — Public API
 * ============================================
 * Drop this folder into your Expo project (e.g. src/features/video-call/)
 * and import:
 *
 *   import { VideoCallScreen, configureVideoCall, videoCallConfig } from '@/features/video-call';
 *
 * Required dependencies in your app:
 *   - expo-constants
 *   - react-native-webrtc
 *   - react-native-safe-area-context
 */
export { VideoCallScreen } from './VideoCallScreen';
export type { VideoCallScreenProps } from './VideoCallScreen';

export { useVideoCall } from './useVideoCall';
export type { UseVideoCallProps, UseVideoCallResult } from './useVideoCall';

export { SignalingClient } from './signalingClient';

export { videoCallConfig, configureVideoCall, pcConfig } from './config';
export type { VideoCallConfig, IceServerConfig } from './config';

export * from './types';
