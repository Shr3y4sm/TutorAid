import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
}

export default function CallHeader({
  title,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: "#111827",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});