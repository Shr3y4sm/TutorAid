import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import supabase from "@/config/supabase";
import { api } from "@/api/client";

export default function TeacherProfileScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [subjects, setSubjects] = useState("");
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] =
    useState("");
  const [experience, setExperience] =
    useState("");

  async function saveTeacher() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Please login again.");
      return;
    }

    try {
      const response = await api<{
        success: boolean;
      }>("/auth/teacher", {
        method: "POST",
        body: JSON.stringify({
          auth_user_id: user.id,
          full_name: fullName,
          email: user.email,
          phone,
          subjects,
          designation,
          organization,
          experience,
        }),
      });

      if (!response.success) {
        throw new Error("Failed");
      }

      router.replace("/(teacher)/dashboard");
    } catch (e) {
      console.log(e);
      Alert.alert("Unable to create teacher.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Complete Teacher Profile
      </Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <TextInput
        placeholder="Subjects"
        value={subjects}
        onChangeText={setSubjects}
        style={styles.input}
      />

      <TextInput
        placeholder="Designation"
        value={designation}
        onChangeText={setDesignation}
        style={styles.input}
      />

      <TextInput
        placeholder="Organization (optional)"
        value={organization}
        onChangeText={setOrganization}
        style={styles.input}
      />

      <TextInput
        placeholder="Experience (optional)"
        value={experience}
        onChangeText={setExperience}
        style={styles.input}
      />

      <Button
        title="Continue"
        onPress={saveTeacher}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
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