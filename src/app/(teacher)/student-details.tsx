import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getStudent } from "@/api/teacherStudents";
import { TeacherStudent } from "@/features/teacher/students/types/student";

export default function StudentDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [student, setStudent] =
    useState<TeacherStudent | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getStudent(id as string);
    setStudent(data);
  }

  if (!student) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.name}>
        {student.full_name}
      </Text>

      <Text>Class : {student.class}</Text>

      <Text>Roll No : {student.roll_no}</Text>

      <Text>Email : {student.email}</Text>

      <Text>Phone : {student.phone}</Text>

      <Text>Parent : {student.parent_name}</Text>

      <Text>Parent Phone : {student.parent_phone}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
  },
});