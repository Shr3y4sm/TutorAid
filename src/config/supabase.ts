import { createClient } from "@supabase/supabase-js";

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

// Polyfill globalThis.WebSocket for React Native / bundler environments.
// In React Native the WebSocket global exists on the global object but may
// not be set on globalThis at module evaluation time, which makes the
// supabase realtime-js WebSocketFactory fail with
// "Node.js detected but native WebSocket not found".
if (typeof globalThis.WebSocket === "undefined") {
  const ws =
    (globalThis as any)?.WebSocket ||
    (typeof WebSocket !== "undefined" ? WebSocket : undefined);

  if (ws) {
    globalThis.WebSocket = ws;
  } else {
    // Minimal guard so bundling doesn't crash; runtime provides the real impl.
    const MockWebSocket = class {
      constructor(_url: string) {}
      send() {}
      close() {}
    };
    globalThis.WebSocket = MockWebSocket as any;
  }
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
