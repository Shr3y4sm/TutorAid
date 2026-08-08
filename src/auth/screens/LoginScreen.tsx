import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { signIn } from "@/services/authService";
import { getAuthStatus } from "@/api/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error("No session created.");
      }

      const status = await getAuthStatus(data.session.user.id);

      if (!status.success) {
        router.replace("/(auth)/role-selection");
        return;
      }

      if (!status.role) {
        router.replace("/(auth)/role-selection");
        return;
      }

      if (!status.profileExists) {
        if (status.role === "teacher") {
          router.replace("/(auth)/teacher-profile");
        } else {
          router.replace("/(auth)/student-profile");
        }
        return;
      }

      if (status.role === "teacher") {
        router.replace("/(teacher)/dashboard");
      } else {
        router.replace("/(student)/home");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert(
        "Login Failed",
        err?.message ?? "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>TutorAid</Text>

        <Text style={styles.subtitle}>
          Learn Anywhere. Teach Everywhere.
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push("/(auth)/register")}
        >
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text style={styles.registerBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 50,
    alignItems: "center",
  },

  logo: {
    fontSize: 40,
    fontWeight: "700",
    color: "#2563EB",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#64748B",
  },

  form: {
    gap: 18,
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 58,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    height: 58,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },

  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },

  registerText: {
    color: "#64748B",
    fontSize: 15,
  },

  registerBold: {
    color: "#2563EB",
    fontWeight: "700",
  },
});