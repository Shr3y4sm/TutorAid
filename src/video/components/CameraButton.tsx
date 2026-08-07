import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";

export default function CameraButton() {
  const { useCameraState } = useCallStateHooks();
  const { isMute, camera } = useCameraState();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => camera.toggle()}
    >
      <Text style={styles.text}>
        {isMute ? "Camera Off" : "Camera On"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1f2937",
    padding: 14,
    borderRadius: 14,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});