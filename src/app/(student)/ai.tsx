import { View, Text, StyleSheet } from "react-native";

export default function AIScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 AI Tutor</Text>
      <Text>Your AI assistant will live here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
});