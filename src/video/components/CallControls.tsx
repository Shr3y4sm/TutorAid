import React from "react";
import { View, StyleSheet } from "react-native";

import CameraButton from "./CameraButton";
import MicrophoneButton from "./MicrophoneButton";
import LeaveButton from "./LeaveButton";
import AudioRouteButton from "./AudioRouteButton";

interface Props {
  onLeave: () => void;
}

export default function CallControls({
  onLeave,
}: Props) {
  return (
    <View style={styles.container}>
      <MicrophoneButton />
      <CameraButton />
      <AudioRouteButton />
      <LeaveButton onLeave={onLeave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
    backgroundColor: "#111827",
  },
});