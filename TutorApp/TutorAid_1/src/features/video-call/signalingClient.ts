/**
 * SignalingClient
 * ----------------
 * A lightweight wrapper around the browser / React-Native `WebSocket` global
 * that adds:
 *
 *  - Automatic reconnection with exponential backoff
 *  - Message-type listener model (event-emitter style)
 *  - Ready-state awareness
 *  - Graceful explicit close vs. unexpected close
 *  - Optional `defaultBody` merged into every outgoing message
 *
 * The signalling server (wss.js) requires `classname` and `username` in
 * the body of every application message, so callers should pass them as
 * `defaultBody`:
 *
 *   const client = new SignalingClient(url, { classname, username });
 *   client.send('join', {});  // server receives { classname, username }
 *
 * Note: The server already sends WebSocket-level ping/pong frames every
 * 30 s for keep-alive, so this client does not send application-level pings.
 */

import { SignalingMessage } from './types';

/** Exponential backoff intervals (ms) used between reconnection attempts. */
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 15000, 30000];

type Listener = (body: any) => void;

export class SignalingClient {
  private url: string;
  private defaultBody: Record<string, any>;
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<Listener>> = new Map();

  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private isIntentionalClose = false;
  private isConnecting = false;

  /** The current readyState of the underlying socket (mirrors WebSocket constants). */
  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  /** `true` when the socket is open and ready to send. */
  get isConnected(): boolean {
    return this.readyState === WebSocket.OPEN;
  }

  /** Returns true if listeners were registered before close (helps debugging). */
  get listenerCount(): number {
    return Array.from(this.listeners.values()).reduce(
      (sum, set) => sum + set.size,
      0
    );
  }

  constructor(url: string, defaultBody: Record<string, any> = {}) {
    this.url = url;
    this.defaultBody = defaultBody;
  }

  // ---- Listener management ------------------------------------------------

  /** Subscribe to a message `type`. Returns an unsubscribe function. */
  on(type: string, listener: Listener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
    return () => this.off(type, listener);
  }

  /** Unsubscribe from a message `type`. */
  off(type: string, listener: Listener): void {
    this.listeners.get(type)?.delete(listener);
  }

  /** Clear all listeners (useful before discarding the client). */
  removeAllListeners(): void {
    this.listeners.clear();
  }

  /** Emit to all listeners of a `type`. */
  private emit(type: string, body: any): void {
    this.listeners.get(type)?.forEach((fn) => fn(body));
  }

  // ---- Connection lifecycle ----------------------------------------------

  /** Open the WebSocket connection (or re-open after a disconnect). */
  connect(): void {
    this.clearReconnectTimer();

    if (this.isIntentionalClose) return;
    if (this.isConnecting) return;

    this.isConnecting = true;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.isIntentionalClose = false;
      this.emit('open', undefined);
    };

    this.ws.onclose = () => {
      this.isConnecting = false;
      this.emit('close', undefined);
      if (!this.isIntentionalClose) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      this.emit('error', error);
    };

    this.ws.onmessage = (message: MessageEvent) => {
      const parsed = this.safeParse(message.data);
      if (!parsed) return;
      const { type, body } = parsed as SignalingMessage;
      this.emit(type, body);
    };
  }

  /** Intentionally close the socket (no reconnection). */
  close(): void {
    this.isIntentionalClose = true;
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /** Attempt to re-open the connection after a delay with exponential backoff. */
  private scheduleReconnect(): void {
    if (this.isIntentionalClose) return;

    const idx = Math.min(this.reconnectAttempts, RECONNECT_DELAYS.length - 1);
    const delay = RECONNECT_DELAYS[idx];

    this.emit('reconnecting', { attempt: this.reconnectAttempts + 1, delay });
    this.reconnectAttempts += 1;

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Force a reconnection — resets the intentional-close flag and backoff
   * counter.  Call this to retry after a disconnect.
   */
  reconnect(): void {
    this.isIntentionalClose = false;
    this.reconnectAttempts = 0;
    this.connect();
  }

  // ---- Sending ------------------------------------------------------------

  /**
   * Send a typed message to the server.
   * The `defaultBody` (e.g. { classname, username }) is merged first,
   * then the caller's body overrides / extends it.
   *
   * Returns `true` if the message was sent, `false` if the socket wasn't open.
   */
  send(type: string, body: any): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }
    try {
      const payload = JSON.stringify({
        type,
        body: { ...this.defaultBody, ...body },
      });
      this.ws.send(payload);
      return true;
    } catch (err) {
      this.emit('error', err);
      return false;
    }
  }

  // ---- Helpers ------------------------------------------------------------

  private safeParse(raw: any): SignalingMessage | null {
    try {
      if (typeof raw === 'string') return JSON.parse(raw) as SignalingMessage;
      return null;
    } catch (err) {
      console.error('[SignalingClient] Failed to parse message:', err);
      return null;
    }
  }
}
