import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ResourcesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resources</Text>
      <Text style={styles.subtitle}>
        Resource management coming soon.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#64748B",
  },
});
