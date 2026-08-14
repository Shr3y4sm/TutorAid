# TutorAid Signalling Server

A WebSocket signalling server for WebRTC video calling. It coordinates peer
discovery, SDP offer/answer/ICE relay, screen-share state, hand-raise state,
and chat within virtual rooms (identified by a `classname`).

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Copy env template and configure
cp .env.example .env

# 3. Start (development with auto-restart)
npm run dev

# 3. Start (production)
npm start
```

The HTTP API listens on `PORT` (default `4000`).
The WebSocket server listens on `WS_PORT` (default `8080`) at path `WS_PATH` (default `/ws`).

## Environment Variables

| Variable        | Default  | Description                                         |
|-----------------|----------|-----------------------------------------------------|
| `PORT`          | `4000`   | HTTP port for `/health` and `/stats`.               |
| `WS_PORT`       | `8080`   | WebSocket port.                                     |
| `WS_PATH`       | `/ws`    | WebSocket URL path (clients connect to this path).  |
| `CORS_ORIGINS`  | `*`      | Comma-separated allow-list of browser origins.      |
| `TLS_KEY_PATH`  | —        | Path to TLS private key (enables WSS).              |
| `TLS_CERT_PATH` | —        | Path to TLS certificate (enables WSS).              |

## HTTP Endpoints

| Method | Path     | Description                                |
|--------|----------|--------------------------------------------|
| `GET`  | `/`      | Server info (ports, ws path, health link). |
| `GET`  | `/health`| `{ status: "ok", timestamp: "..." }`.      |
| `GET`  | `/stats` | `{ rooms, totalUsers, connectedClients }`. |

## WebSocket Protocol

Clients connect to `ws://<host>:<WS_PORT><WS_PATH>` and send/receive JSON messages
of the form `{ "type": "...", "body": {...} }`.

### Client → Server messages

| Type                   | Body                                                        |
|------------------------|-------------------------------------------------------------|
| `join`                 | `{ classname, username }`                                   |
| `quit`                 | `{ classname, username }`                                   |
| `request_screen_share` | `{ classname, username, enable }`                           |
| `request_hand_raise`   | `{ classname, username, raised }`                           |
| `send_offer`           | `{ classname, username, target, sdp }`                      |
| `send_answer`          | `{ classname, username, target, sdp }`                      |
| `send_ice_candidate`   | `{ classname, username, target, candidate }`                |
| `send_chat_message`    | `{ classname, username, target?, message }`                 |
| `ping`                 | `{}`                                                        |

### Server → Client messages

| Type                    | Body                                        |
|-------------------------|---------------------------------------------|
| `joined`                | `["user1", "user2"]` (array of existing)    |
| `user_joined`           | `{ username }`                              |
| `peer_left`             | `{ username }`                              |
| `offer_sdp_received`    | `{ sender, sdp }`                           |
| `answer_sdp_received`   | `{ sender, sdp }`                           |
| `ice_candidate_received`| `{ sender, candidate }`                     |
| `screen_share_state`    | `{ active, username }`                      |
| `screen_share_denied`   | `{ active, username, reason }`              |
| `hand_raise_state`      | `{ raisedHands }`                           |
| `chat_message_received` | `{ sender, message }`                       |
| `error`                 | `{ message }`                               |
| `pong`                  | `{ ts }`                                    |

## Deployment

### Option A — Docker

```bash
docker build -t tutoraid-signalling .
docker run -d \
  -p 4000:4000 -p 8080:8080 \
  -e CORS_ORIGINS=https://your-app.com \
  --restart unless-stopped \
  tutoraid-signalling
```

### Option B — Cloud platforms (Render, Railway, Fly.io)

1. Deploy this folder as a Node.js service.
2. Set the environment variables above (especially `CORS_ORIGINS`).
3. Expose ports `4000` and `8080`.

### Option C — VPS with TLS (recommended for production)

Browsers require HTTPS/WSS for `getUserMedia`. On a VPS:

```bash
# Obtain a certificate (e.g. with Caddy or certbot)
# Then enable TLS:
cp .env.example .env
# Edit .env:
# TLS_KEY_PATH=/path/to/fullchain.key
# TLS_CERT_PATH=/path/to/fullchain.pem
npm start
```

Place a reverse proxy (Caddy/Nginx/Traefik) in front to serve HTTPS on the HTTP
port and proxy WebSocket traffic, or point clients at the WSS endpoint directly.

## TURN Servers

The signalling server does **not** provide TURN relays. For users behind
symmetric NATs or corporate firewalls, deploy or subscribe to a TURN server
(e.g. [Metered](https://metered.ca/), [Twilio](https://www.twilio.com/turn),
[Cloudflare TURN](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/use-cases/warp/))
and configure its URL in the app's `config.ts`.
