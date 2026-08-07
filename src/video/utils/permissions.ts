// Video module is currently deferred.
// The Stream video call feature is not active yet, so we provide
// a no-op permission helper instead of importing camera/audio
// packages that are not installed.
//
// When video is re-enabled, install `expo-camera` and use its
// permission API during the CallProvider initialization.

export async function requestPermissions() {
  return {
    camera: false,
    microphone: false,
  };
}