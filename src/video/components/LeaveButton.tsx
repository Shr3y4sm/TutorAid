import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  onLeave: () => void;
}

export default function LeaveButton({ onLeave }: Props) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onLeave}
    >
      <Text style={styles.text}>
        Leave
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 14,
  },
  text: {
    color: "#fff",
    fontWeight: "700",
  },
});