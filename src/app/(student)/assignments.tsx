import { View, Text, StyleSheet } from "react-native";

export default function AssignmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Assignments</Text>
      <Text>No assignments yet.</Text>
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