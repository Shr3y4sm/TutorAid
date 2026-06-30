import { Camera } from "expo-camera";
import { Audio } from "expo-av";

export async function requestPermissions() {
  const camera = await Camera.requestCameraPermissionsAsync();

  const microphone = await Audio.requestPermissionsAsync();

  return {
    camera:
      camera.status === "granted",

    microphone:
      microphone.status === "granted",
  };
}