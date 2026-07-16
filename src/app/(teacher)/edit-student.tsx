import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import {
  getStudent,
  updateStudent,
} from "@/api/teacherStudents";

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] =
    useState(true);

  const [fullName, setFullName] =
    useState("");

  const [studentClass, setStudentClass] =
    useState("");

  const [rollNo, setRollNo] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [parentName, setParentName] =
    useState("");

  const [parentPhone, setParentPhone] =
    useState("");

  useEffect(() => {
    loadStudent();
  }, []);

  async function loadStudent() {
    try {
      const student =
        await getStudent(id as string);

      setFullName(student.full_name ?? "");

      setStudentClass(student.class ?? "");

      setRollNo(student.roll_no ?? "");

      setEmail(student.email ?? "");

      setPhone(student.phone ?? "");

      setParentName(
        student.parent_name ?? ""
      );

      setParentPhone(
        student.parent_phone ?? ""
      );
    } catch {
      Alert.alert(
        "Error",
        "Unable to load student."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveStudent() {
    try {
      await updateStudent(
        id as string,
        {
          full_name: fullName,
          class: studentClass,
          roll_no: rollNo,
          email,
          phone,
          parent_name: parentName,
          parent_phone: parentPhone,
        }
      );

      Alert.alert(
        "Success",
        "Student updated."
      );

      router.back();

    } catch {
      Alert.alert(
        "Error",
        "Update failed."
      );
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Edit Student
      </Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />

      <TextInput
        placeholder="Class"
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
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Phone"
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
        value={parentPhone}
        onChangeText={setParentPhone}
        style={styles.input}
      />

      <Button
        title="Update Student"
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