import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import { signUp } from "@/services/authService";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    const { error } = await signUp(email, password);

    if (error) {
      Alert.alert("Registration Failed", error.message);
      return;
    }

    Alert.alert(
      "Success",
      "Account created successfully."
    );

    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <Button
        title="Create Account"
        onPress={register}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
});
