# TutorAid Video-Calling Feature

A self-contained, production-ready video-calling module built on WebRTC.
It works on **web, iOS, and Android** from a single codebase using Expo +
`react-native-webrtc`.

## What's included

| File | Description |
|------|-------------|
| `VideoCallScreen.tsx` | Drop-in screen component (`classname`, `username`, `serverUrl`, `iceServers`) |
| `useVideoCall.ts` | Unified cross-platform hook (WebRTC + WebSocket + reconnection) |
| `signalingClient.ts` | Auto-reconnecting WebSocket client with ping/keep-alive |
| `config.ts` | Server URL + STUN/TURN resolution (env / expo-constants) |
| `types.ts` | Shared TypeScript types |
| `components/` | `VideoTile`, `ControlsBar`, `ParticipantsModal`, `ParticipantRow`, `ChatPanel`, `StatusHeader` |

## Features

- 1-to-N mesh video calling (each peer connects directly to every other peer)
- Mute / unmute microphone
- Camera on/off
- Front / back camera switch (mobile)
- Screen sharing (web via `getDisplayMedia`)
- Hand raising with live state sync
- In-call text chat (direct messages between participants)
- Participant list with unread-message badges
- Auto-reconnecting WebSocket signalling
- Connection state UI (connecting, reconnecting, disconnected, error)
- Waiting-for-participants empty state
- Configurable STUN + TURN servers

## Requirements

Your Expo project must have these dependencies:

```bash
expo install expo-constants react-native-safe-area-context
npm install react-native-webrtc
```

> `react-native-webrtc` requires native setup (iOS/Android). See its
> [installation guide](https://github.com/react-native-webrtc/react-native-webrtc#installation)
> for pod install steps.

## Quick integration

1. Copy the `src/features/video-call/` folder into your Expo project:

```
your-expo-app/
  src/
    features/
      video-call/      ← copy here
```

2. Create an Expo Router route that uses the screen (e.g. `app/video.tsx`):

```tsx
import { useLocalSearchParams } from 'expo-router';
import { VideoCallScreen } from '@/features/video-call';

export default function VideoRoute() {
  const { classname, username } = useLocalSearchParams();
  return (
    <VideoCallScreen
      classname={String(classname)}
      username={String(username)}
    />
  );
}
```

3. Set the signalling server URL. Two options:

**Option A — Runtime override (recommended for testing):**
```tsx
<VideoCallScreen
  classname="ABC123"
  username="alice"
  serverUrl="wss://your-server.com/ws"
/>
```

**Option B — app.json (recommended for production):**
```json
{
  "expo": {
    "extra": {
      "signalingUrl": "wss://your-server.com/ws",
      "turnUrl": "turn:your-turn-server.com:3478",
      "turnUsername": "your-username",
      "turnPassword": "your-password"
    }
  }
}
```

## Configuration

All settings live in `config.ts` and are resolved in this priority order:

1. **Props** passed to `<VideoCallScreen>` (`serverUrl`, `iceServers`)
2. **Expo constants** (`extra.signalingUrl`, `extra.turnUrl`, etc.)
3. **Environment variables** (`EXPO_PUBLIC_SIGNALING_URL`, `EXPO_PUBLIC_TURN_*`)
4. **Web auto-detection** (derives `wss://` from the current page origin)
5. **Defaults** (`ws://localhost:8080/ws` + Google STUN)

## Mobile screen sharing

Screen capturing the device display on iOS/Android requires native modules
not bundled in this package. On mobile, the screen-share button is disabled
and shows a toast: *"Screen sharing is only available on web browsers."*

To add native screen sharing later, install
`@eugurlabs/react-native-screen-capture` (Android) or use `react-native-webrtc`'s
`getDisplayMedia` (iOS 18+), then wire it into `useVideoCall.ts`'s
`startScreenCapture`.

## WebSocket protocol

See the [signalling-server README](../../signalling-server/README.md) for the
full message protocol reference.

## License

MIT
