/**
 * TutorAid mobile — runtime configuration.
 *
 * Resolution priority (first non-empty wins):
 *   1. `EXPO_PUBLIC_*` env vars  (EAS build / runtime inlining)
 *   2. `extra.*` in app.json      (static per build profile)
 *   3. Built-in dev defaults      (localhost + demo Supabase project)
 *
 * `babel-preset-expo` does NOT load `.env` files into process.env, so in a
 * local `expo start` session the only available source is `extra` here. For
 * production EAS builds, prefer setting the EXPO_PUBLIC_* env vars — they
 * override these defaults so you never have to commit prod secrets.
 */

import Constants from "expo-constants";

const extra: Record<string, any> =
  (Constants?.expoConfig?.extra as Record<string, any>) ?? {};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  extra.apiBaseUrl ||
  "http://localhost:3000";

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  extra.supabaseUrl ||
  "https://mwoysjrkdgmnkpxvwitw.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  extra.supabaseAnonKey ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b3lzanJrZGdtbmtweHZ3aXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwOTA1NTAsImV4cCI6MjA5ODY2NjU1MH0.QF-biT64UwmKX2GkXSPPYf5i8hpUIFnm7cPGncwFK1Y";

/** WebSocket URL of the WebRTC signalling server (e.g. wss://host:8080/ws). */
export const SIGNALING_URL =
  process.env.EXPO_PUBLIC_SIGNALING_URL ||
  extra.signalingUrl ||
  "ws://localhost:8080/ws";

export interface TurnServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

/**
 * TURN servers as a JSON array string, e.g.
 * '[{"urls":"turn:turn.example.com:3478","username":"tutoraid","credential":"secret"}]'
 * Empty by default → rely on STUN alone (works for direct connections on LAN).
 */
export const TURN_SERVERS: TurnServer[] = JSON.parse(
  process.env.EXPO_PUBLIC_TURN_SERVERS ||
    extra.turnServers ||
    "[]"
);

// Exposed only for debugging tooling — not used in render paths.
export const __envDebug = {
  API_BASE_URL,
  SIGNALING_URL,
  hasTurn: TURN_SERVERS.length > 0,
};
