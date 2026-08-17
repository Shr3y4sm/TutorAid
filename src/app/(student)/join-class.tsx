import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function JoinClassScreen() {
  const [meetCode, setMeetCode] = useState("");
  const [username, setUsername] = useState("Student");

  function handleJoin() {
    const code = meetCode.trim().toUpperCase();

    if (!code) {
      Alert.alert("Missing Code", "Please enter the meet code.");
      return;
    }

    // Navigate to the video call with the entered meet code
    router.push({
      pathname: "/(video)/call",
      params: {
        classname: code,
        username: username || "Student",
      },
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="videocam" size={40} color="#2563EB" />
          </View>
          <Text style={styles.title}>Join a Class</Text>
          <Text style={styles.subtitle}>
            Enter the meet code provided by your teacher
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Meet Code</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. TA-ABC123"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
            autoCorrect={false}
            value={meetCode}
            onChangeText={setMeetCode}
            onSubmitEditing={handleJoin}
          />

          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
          />

          <TouchableOpacity
            style={styles.joinButton}
            onPress={handleJoin}
          >
            <Ionicons name="videocam" size={20} color="#FFF" />
            <Text style={styles.joinButtonText}>Join Class</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hintBox}>
          <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
          <Text style={styles.hintText}>
            Ask your teacher for the meet code to join the live class.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: -4,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 56,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#111827",
  },
  joinButton: {
    height: 56,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  joinButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 30,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 14,
  },
  hintText: {
    flex: 1,
    color: "#6B7280",
    fontSize: 13,
  },
});