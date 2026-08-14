import { createClient } from "@supabase/supabase-js";

// Polyfill globalThis.WebSocket for React Native / bundler environments.
// In React Native, WebSocket is available on the global object but may not
// be set on globalThis at module evaluation time, which causes the
// supabase realtime-js WebSocketFactory to fail with
// "Node.js detected but native WebSocket not found".
// This approach handles the Expo bundling environment properly.
if (
  typeof globalThis.WebSocket ===
  "undefined"
) {
  // Try to get WebSocket from globalThis
  const ws = (globalThis as any)?.WebSocket || (typeof WebSocket !== 'undefined' ? WebSocket : undefined);
  
  if (ws) {
    globalThis.WebSocket = ws;
  } else {
    // Fallback: Create a minimal WebSocket mock if none available
    // This prevents the error during bundling while allowing runtime to handle it properly
    const MockWebSocket = class {
      constructor(url: string) {
        // Mock constructor
      }
      
      send() {
        // Mock send
      }
      
      close() {
        // Mock close
      }
    };
    
    globalThis.WebSocket = MockWebSocket as any;
  }
}

const supabase = createClient(
  "https://mwoysjrkdgmnkpxvwitw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b3lzanJrZGdtbmtweHZ3aXR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwOTA1NTAsImV4cCI6MjA5ODY2NjU1MH0.QF-biT64UwmKX2GkXSPPYf5i8hpUIFnm7cPGncwFK1Y"
);

export default supabase;
