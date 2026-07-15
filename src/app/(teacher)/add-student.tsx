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

import { createStudent } from "@/api/teacherStudents";
import { getCurrentTeacherId } from "@/services/teacherService";

export default function AddStudentScreen() {
  const [fullName, setFullName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");

  async function saveStudent() {
    try {
      if (!fullName.trim()) {
        Alert.alert("Error", "Enter student name.");
        return;
      }

      if (!studentClass.trim()) {
        Alert.alert("Error", "Enter student class.");
        return;
      }

      const teacherId = await getCurrentTeacherId();

      await createStudent({
        teacherId,
        full_name: fullName,
        class: studentClass,
        roll_no: rollNo,
        email,
        phone,
        parent_name: parentName,
        parent_phone: parentPhone,
      });

      Alert.alert(
        "Success",
        "Student added successfully."
      );

      router.back();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message || "Failed to add student."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Add Student
      </Text>

      <TextInput
        placeholder="Full Name *"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Class *"
        value={studentClass}
        onChangeText={setStudentClass}
        style={styles.input}
      />

      <TextInput
        placeholder="Roll Number"
        value={rollNo}
        onChangeText={setRollNo}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      <TextInput
        placeholder="Parent Name"
        value={parentName}
        onChangeText={setParentName}
        style={styles.input}
      />

      <TextInput
        placeholder="Parent Phone"
        keyboardType="phone-pad"
        value={parentPhone}
        onChangeText={setParentPhone}
        style={styles.input}
      />

      <Button
        title="Save Student"
        onPress={saveStudent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
});