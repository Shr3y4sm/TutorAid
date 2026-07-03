import { View, Text, StyleSheet } from "react-native";

export default function CallScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Video Module Deferred
      </Text>

      <Text style={styles.subtitle}>
        Stream Video will be enabled after the rest of TutorAid is complete.
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