/**
 * /video route (web)
 *
 * Identical thin wrapper — VideoCallScreen handles web natively.
 * Having a dedicated .web.tsx file avoids importing react-native-webrtc
 * types during the web bundle, although VideoCallScreen already guards
 * the native import with a Platform check.
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
