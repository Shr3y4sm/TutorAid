import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

export default function SubmitAssignmentScreen() {
  function handleSubmit() {
    Alert.alert(
      "Coming Soon",
      "Assignment submission will be enabled once file uploads are re-enabled."
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Submit Assignment
      </Text>

      <Text style={styles.text}>
        File uploads are temporarily disabled while using Expo Go.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});