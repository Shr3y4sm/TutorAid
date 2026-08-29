# Deployment

## Production (Caddy + TLS + WSS)

Boot the API + signalling behind a TLS-terminating reverse proxy in one step:

```bash
# from repo root
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

What you get:

| Service   | Internal | External |
|-----------|----------|----------|
| `api`     | `:3000`  | (through your host/optional Caddy) |
| `signalling` | `:4000` | `:8443` (WSS via Caddy) |
| `caddy`   | —        | `:80`, `:443`, `:8443` |

Caddy auto-obtains Let's Encrypt certificates for your domain (set it in
`deploy/Caddyfile`), and rewrites the `/ws` WebSocket path to WSS on
`:8443/signal`. No TLS keys need to be mounted into the signalling container —
it stays plain WS internally.

### Point the app at it

In your mobile build / `app.json` `extra`:

```
EXPO_PUBLIC_SIGNALING_URL=wss://signal.example.com:8443/ws
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
```

> `getUserMedia` (camera/mic) only works on secure origins, so the signalling
> server **must** be served over WSS in production — this Caddy layer provides
> that.

## TURN relay

Add a TURN server for real-NAT traversal (recommended for any non-LAN beta):

```
EXPO_PUBLIC_TURN_SERVERS=[{"urls":"turn:turn.example.com:3478","username":"tutoraid","credential":"secret"}]
```

(Metered / Xirsys free tiers are fine to start.)

## Without TLS (dev / LAN only)

```bash
docker compose up -d --build     # api + signalling on :3000 / :4000 / :8080
curl localhost:3000/health       # api
curl localhost:4000/health       # signalling
```

Works for same-network testing; end-to-end calls across NAT need the TLS + TURN setup above.