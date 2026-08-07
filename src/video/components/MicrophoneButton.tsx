import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";

export default function MicrophoneButton() {
  const { useMicrophoneState } = useCallStateHooks();
  const { optimisticIsMute, microphone } = useMicrophoneState();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => microphone.toggle()}
    >
      <Text style={styles.text}>
        {optimisticIsMute ? "Unmute" : "Mute"}
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