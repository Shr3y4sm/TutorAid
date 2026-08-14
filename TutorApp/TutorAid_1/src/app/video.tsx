/**
 * /video route (native: iOS + Android)
 *
 * This is now a thin wrapper around the self-contained VideoCallScreen
 * from the video-call-feature module. All WebRTC logic lives in
 * src/features/video-call/useVideoCall.ts.
 */
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
