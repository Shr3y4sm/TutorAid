import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  useMicrophoneState,
} from "@stream-io/video-react-native-sdk";

export default function MicrophoneButton() {
  const { microphone, isMute } = useMicrophoneState();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => microphone.toggle()}
    >
      <Text style={styles.text}>
        {isMute ? "Unmute" : "Mute"}
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