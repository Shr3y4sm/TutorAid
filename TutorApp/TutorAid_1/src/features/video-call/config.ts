/**
 * Central configuration for the TutorAid video-calling feature.
 *
 * The signalling server URL and ICE (STUN/TURN) servers are resolved at
 * runtime from the following (in priority order):
 *
 *   1. Expo-constants `extra` (set in app.json → expo.extra)
 *   2. Environment variables (EXPO_PUBLIC_*)
 *   3. Web auto-detection (derive WSS from the current page origin)
 *   4. Sensible defaults
 *
 * Consumers can also call `configureVideoCall()` before mounting the screen
 * to override values programmatically.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

/** WebRTC ICE server configuration. */
export interface IceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface VideoCallConfig {
  /** WebSocket URL of the signalling server (e.g. "wss://your-app.com/ws"). */
  signalingUrl: string;
  /** ICE servers (STUN / TURN) used by RTCPeerConnection. */
  iceServers: IceServerConfig[];
}

// Default STUN servers (Google public STUN, free for reasonable usage).
const DEFAULT_ICE_SERVERS: IceServerConfig[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
];

// Runtime configuration object — mutated by configureVideoCall().
export const videoCallConfig: VideoCallConfig = {
  signalingUrl: resolveSignalingUrl(),
  iceServers: resolveIceServers(),
};

// ---- Resolution helpers --------------------------------------------------

/**
 * Resolve the signalling server WebSocket URL.
 *
 * Priority:
 *   1. expo-constants extra.signalingUrl
 *   2. EXPO_PUBLIC_SIGNALING_URL / SIGNALING_URL env var
 *   3. On web: derive from window.location (same-origin assumption)
 *   4. Default localhost
 */
function resolveSignalingUrl(): string {
  // 1. Expo constants override
  const fromConstants = (Constants?.expoConfig?.extra as any)?.signalingUrl as
    | string
    | undefined;
  if (fromConstants) return fromConstants;

  // 2. Env var override (works in EAS builds and dev)
  const fromEnv =
    process.env.EXPO_PUBLIC_SIGNALING_URL || process.env.SIGNALING_URL;
  if (fromEnv) return fromEnv;

  // 3. Web: derive from current page origin
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const path = window.location.pathname === '/' ? '' : '';
    return `${protocol}//${host}${path}`;
  }

  // 4. Native dev default
  //    Android emulator routes localhost to the emulator itself,
  //    so 10.0.2.2 points back to the host machine.
  if (Platform.OS === 'android') {
    return 'ws://10.0.2.2:8080/ws';
  }
  // iOS simulator / device: localhost works for the simulator.
  return 'ws://localhost:8080/ws';
}

/**
 * Resolve the ICE servers list.
 *
 * If TURN credentials are provided (via expo-constants or env vars), they are
 * appended to the default STUN servers.
 */
function resolveIceServers(): IceServerConfig[] {
  const extra = (Constants?.expoConfig?.extra as any) || {};

  const turnUrl =
    process.env.EXPO_PUBLIC_TURN_URL || extra.turnUrl;
  const turnUser =
    process.env.EXPO_PUBLIC_TURN_USERNAME || extra.turnUsername;
  const turnPass =
    process.env.EXPO_PUBLIC_TURN_PASSWORD || extra.turnPassword;

  // Allow an array of TURN server URLs via env (comma-separated)
  const turnUrlsEnv =
    process.env.EXPO_PUBLIC_TURN_URLS || extra.turnUrls;
  const turnUrls: string[] = turnUrlsEnv
    ? String(turnUrlsEnv).split(',').map((u) => u.trim())
    : turnUrl
    ? [turnUrl]
    : [];

  if (turnUrls.length > 0 && turnUser && turnPass) {
    return [
      ...DEFAULT_ICE_SERVERS,
      ...turnUrls.map((url) => ({
        urls: url,
        username: turnUser,
        credential: turnPass,
      })),
    ];
  }

  return DEFAULT_ICE_SERVERS;
}

/**
 * Programmatically override the video-call configuration.
 *
 * Call this once before rendering `VideoCallScreen`, e.g.:
 *
 * ```ts
 * configureVideoCall({
 *   signalingUrl: "wss://your-app.com/ws",
 *   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
 * });
 * ```
 */
export function configureVideoCall(overrides: Partial<VideoCallConfig>): void {
  if (overrides.signalingUrl) {
    videoCallConfig.signalingUrl = overrides.signalingUrl;
  }
  if (overrides.iceServers) {
    videoCallConfig.iceServers = overrides.iceServers;
  }
}

/**
 * The WebRTC peer-connection constraints built from the active config.
 * Exported so the hook can use a stable reference.
 */
export const pcConfig: RTCConfiguration = {
  iceServers: videoCallConfig.iceServers as any,
};
