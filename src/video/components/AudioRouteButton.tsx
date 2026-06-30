import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function AudioRouteButton() {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>Speaker</Text>
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
  },
});