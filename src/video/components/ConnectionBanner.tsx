import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  visible: boolean;
}

export default function ConnectionBanner({
  visible,
}: Props) {
  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        Reconnecting...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#f59e0b",
    padding: 8,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});