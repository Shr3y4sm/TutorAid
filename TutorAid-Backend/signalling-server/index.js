/**
 * TutorAid Signalling Server
 * --------------------------
 * Express server that:
 *   1. Serves a /health endpoint for uptime monitoring.
 *   2. Serves the WebSocket signalling server (WSS) for WebRTC room coordination.
 *
 * Configuration via environment variables (see .env.example):
 *   - PORT             HTTP port              (default 4000)
 *   - WS_PORT          WebSocket port         (default 8080)
 *   - WS_PATH          WebSocket URL path      (default /ws)
 *   - CORS_ORIGINS     Comma-separated allow-list for CORS/health
 *   - TLS_KEY_PATH     Path to TLS private key  (enables WSS)
 *   - TLS_CERT_PATH    Path to TLS certificate   (enables WSS)
 */

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const wss = require('./wss');

const HTTP_PORT = parseInt(process.env.PORT, 10) || 4000;
const WEB_SOCKET_PORT = parseInt(process.env.WS_PORT, 10) || 8080;
const WS_PATH = process.env.WS_PATH || '/ws';
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : '*';

const app = express();

// ---- CORS ----
app.use(cors({ origin: CORS_ORIGINS === '*' ? true : CORS_ORIGINS }));

// ---- Health check ----
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Root info ----
app.get('/', (req, res) => {
  res.json({
    name: 'TutorAid Signalling Server',
    wsPort: WEB_SOCKET_PORT,
    wsPath: WS_PATH,
    health: '/health',
  });
});

// ---- Initialise WebSocket server ----
const options = {
  port: WEB_SOCKET_PORT,
  path: WS_PATH,
  origins: CORS_ORIGINS === '*' ? null : CORS_ORIGINS,
};

// If TLS files are provided, the WebSocket server will run as WSS (secure)
if (process.env.TLS_KEY_PATH && process.env.TLS_CERT_PATH) {
  options.key = fs.readFileSync(process.env.TLS_KEY_PATH);
  options.cert = fs.readFileSync(process.env.TLS_CERT_PATH);
  console.log('TLS enabled — WSS will be available.');
}

const { getStats } = wss.init(options);

// Expose stats at /stats (useful for monitoring dashboards)
app.get('/stats', (req, res) => {
  res.json(getStats());
});

app.listen(HTTP_PORT, () => {
  console.log(`Signalling HTTP server listening on port ${HTTP_PORT}`);
  console.log(`WebSocket server on port ${WEB_SOCKET_PORT}${WS_PATH}`);
});

module.exports = { app, getStats };
