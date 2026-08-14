# TutorApp — Video Calling for TutorAid

A complete, production-ready video calling feature built on **WebRTC** for the
TutorAid tutoring app.  It supports web, iOS, and Android from a single
Expo codebase.

## Project structure

```
TutorApp/
├── README.md                          ← this file
├── package-lock.json
├── signalling-server/                 ← Node.js + ws signalling server
│   ├── index.js          (Docker entry point)
│   ├── wss.js            (WebSocket server + room protocol)
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
│
├── video-call-feature/                ← Self-contained feature module (the deliverable)
│   ├── src/
│   │   └── features/
│   │       └── video-call/
│   │           ├── VideoCallScreen.tsx   ← Drop-in screen component
│   │           ├── useVideoCall.ts        ← Unified cross-platform hook
│   │           ├── signalingClient.ts     ← Reconnecting WebSocket client
│   │           ├── config.ts              ← Server URL + STUN/TURN resolution
│   │           ├── types.ts               ← Shared TypeScript types
│   │           ├── index.ts               ← Public barrel export
│   │           ├── components/
│   │           │   ├── VideoTile.tsx
│   │           │   ├── ControlsBar.tsx
│   │           │   ├── ParticipantsModal.tsx
│   │           │   ├── ParticipantRow.tsx
│   │           │   ├── ChatPanel.tsx
│   │           │   └── StatusHeader.tsx
│   │           └── package.json          ← peerDependencies
│   ├── tsconfig.json
│   └── README.md
│
└── TutorAid_1/                          ← Development / demo Expo app
    ├── app.json
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── app/
        │   ├── index.tsx        ← Home: enter class code + username
        │   ├── video.tsx        ← Thin wrapper → <VideoCallScreen />
        │   └── video.web.tsx    ← Thin wrapper → <VideoCallScreen /> (web)
        └── features/
            └── video-call/      ← Copied from video-call-feature/
```

## Quick start

### 1. Start the signalling server

```bash
cd signalling-server
npm install
npm start
# or with Docker:
# docker build -t tutoraid-signalling . && docker run -p 8080:8080 tutoraid-signalling
```

The server listens on port **8080** at path **/ws**.

### 2. Run the demo app

```bash
cd TutorAid_1
npm install
npm start        # press 'w' for web, 'a' for Android, 'i' for iOS
```

Enter a username, create or join a class, and the video call screen opens
automatically.

> **Android emulator**: the demo app connects to `ws://10.0.2.2:8080/ws`
> (emulator loopback).  **iOS simulator / web**: `ws://localhost:8080/ws`.

### 3. Run with your own server

```tsx
import { VideoCallScreen } from '@/features/video-call';

<VideoCallScreen
  classname="ABC123"
  username="alice"
  serverUrl="wss://your-server.com/ws"
/>
```

See [`video-call-feature/INTEGRATION.md`](video-call-feature/INTEGRATION.md)
for the full integration guide.

## Architecture

```
 ┌─────────────────────────────────────────────────────┐
 │                 Signalling Server                   │
 │  (Node.js + ws, port 8080, path /ws)                │
 │                                                     │
 │  Room state: { users, screenSharer, raisedHands }   │
 └─────────────────────────────────────────────────────┘
                    ▲  WebSocket (JSON messages)
                    │  join / quit / send_offer / etc.
   ┌────────────────┴────────────────┐
   │         useVideoCall hook        │
   │  (WebRTC + SignallingClient)      │
   │  - Creates RTCPeerConnection      │
   │  - Exchanges SDP via WebSocket    │
   │  - Relays ICE candidates          │
   │  - Handles reconnect & cleanup    │
   └────────────┬──────────────────────┘
                │ React state
   ┌────────────┴──────────────────────┐
   │        VideoCallScreen            │
   │  (renders tiles, controls, chat)  │
   └─────────────────────────────────────┘
```

**Connection model**: 1-to-N mesh — each participant opens a direct
peer-to-peer WebRTC connection to every other participant.  The signalling
server only relays metadata (SDP, ICE, chat, state) — media flows P2P.

## Features

| Feature | Status |
|---------|--------|
| Audio / video (camera + mic) | ✅ |
| Mute / unmute | ✅ |
| Camera on/off | ✅ |
| Front/back camera switch (mobile) | ✅ |
| Screen sharing (web) | ✅ |
| Hand raising (live sync) | ✅ |
| In-call text chat | ✅ |
| Participant list + unread badges | ✅ |
| Auto-reconnecting WebSocket | ✅ |
| Connection state UI | ✅ |
| WebRTC mesh (1-to-N) | ✅ |
| Screen-share blocking (one at a time) | ✅ |
| Expo Router route | ✅ |
| iOS/Android permissions | ✅ |
| Configurable STUN + TURN | ✅ |

## Technologies

| Layer | Technology |
|-------|-----------|
| Signalling | Node.js + `ws` |
| WebRTC | `react-native-webrtc` (native), browser `RTCPeerConnection` (web) |
| UI | React Native + Expo |
| Navigation | Expo Router |
| Styling | React Native `StyleSheet` |
