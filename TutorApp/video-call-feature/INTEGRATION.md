# Integration Guide — TutorAid Video Calling

This guide shows how to integrate the video-calling feature into any Expo
application.

## Prerequisites

Your Expo project (Expo SDK ≥ 51) must have:

```bash
expo install expo-constants react-native-safe-area-context
npm install react-native-webrtc
```

> **iOS/Android**: After installing `react-native-webrtc`, run
> `cd ios && pod install` (iOS) and ensure the native module is linked
> (Expo pre-configures this for auto-linked libraries).

## Step 1 — Copy the feature

```
your-project/
  src/
    features/
      video-call/        ← copy from video-call-feature/src/features/video-call
```

Then create a barrel alias in your `tsconfig.json`:
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## Step 2 — Add a route

**Expo Router** (`app/video.tsx`):

```tsx
import { useLocalSearchParams } from 'expo-router';
import { VideoCallScreen } from '@/features/video-call';

export default function VideoRoute() {
  const { classname, username } = useLocalSearchParams();
  return (
    <VideoCallScreen
      classname={String(classname ?? '')}
      username={String(username ?? 'unknown')}
    />
  );
}
```

**React Navigation**:

```tsx
import { VideoCallScreen } from '@/features/video-call';

function VideoScreen({ route }) {
  const { classname, username } = route.params;
  return <VideoCallScreen classname={classname} username={username} />;
}
```

## Step 3 — Configure permissions

Add to your `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs camera access for video calls.",
        "NSMicrophoneUsageDescription": "This app needs microphone access for audio in video calls."
      }
    },
    "android": {
      "permissions": ["CAMERA", "RECORD_AUDIO", "INTERNET"]
    }
  }
}
```

## Step 4 — Point to your signalling server

The feature resolves the server URL in this order:

1. **`serverUrl` prop** (highest priority)
2. **`extra.signalingUrl`** in `app.json`
3. **`EXPO_PUBLIC_SIGNALING_URL`** env variable
4. **Web auto-detection** — derives `wss://` from `window.location`
5. **`ws://localhost:8080/ws`** (fallback default)

Example `app.json`:
```json
{
  "expo": {
    "extra": {
      "signalingUrl": "wss://your-domain.com/ws",
      "turnUrl": "turn:your-turn-server.com:3478",
      "turnUsername": "your-username",
      "turnPassword": "your-password"
    }
  }
}
```

Set the env variable for local dev:
```bash
EXPO_PUBLIC_SIGNALING_URL=ws://localhost:8080/ws
```

## Step 5 — Add TURN servers (production)

For production behind NAT/firewalls, add TURN servers in `app.json` → `extra`:

```json
{
  "expo": {
    "extra": {
      "turnUrl": "turn:turn.example.com:3478",
      "turnUsername": "tutoraid",
      "turnPassword": "supersecret"
    }
  }
}
```

## Step 6 — Start the signalling server

```bash
cd signalling-server
npm install
node index.js
```

Or with Docker:
```bash
docker build -t tutoraid-signalling . && docker run -p 8080:8080 tutoraid-signalling
```

## API reference

### `<VideoCallScreen>` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `classname` | `string` | **(required)** | Room/class code to join |
| `username` | `string` | **(required)** | User's display name |
| `serverUrl` | `string?` | auto | Override signalling server URL |
| `iceServers` | `any[]` | defaults | Override STUN/TURN servers |
| `autoJoin` | `boolean` | `true` | Auto-connect on mount |

### `useVideoCall()` return values

All WebRTC state and control functions: `localStream`, `remoteStreams`,
`isMuted`, `isCameraOff`, `isScreenSharing`, `isHandRaised`, `raisedHands`,
`joinedUsers`, `chatTarget`, `chatMessages`, `unreadCounts`, `totalUnread`,
`isParticipantsVisible`, `connectionState`, `signallingConnected`,
`reconnecting`, `reconnectAttempt`, `error`, `screenShareDeniedMsg`,
`cameraDirection`, `totalUnread`, and control callbacks (`toggleMute`,
`toggleCamera`, `switchCamera`, `toggleScreenShare`, `toggleHandRaise`,
`endCall`, `openParticipants`, `closeParticipants`, `selectUserForChat`,
`closeChat`, `sendChatMessage`, `retryConnection`).

## Troubleshooting

| Problem | Solution |
|---------|----------|
| No video on web | Check browser console → ensure `getUserMedia` permission is granted |
| No video on Android emulator | Server URL uses `10.0.2.2` for localhost |
| No video on iOS simulator | Ensure `NSCameraUsageDescription` is in `app.json` |
| Peers can't connect | Add TURN servers — most NATs block pure P2P |
| Screen sharing greyed out | Web only — requires HTTPS and `getDisplayMedia` |
| Chat not delivering | Verify both users are in the same room/class |
