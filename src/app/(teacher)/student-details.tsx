import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
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

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (id) {
      load();
    }
  }, [id]);

  async function load() {
    try {
      const data = await getStudent(
        String(id)
      );

      setStudent(data);
    } catch (err: any) {
      console.log(err);

      Alert.alert(
        "Error",
        err?.message ??
          "Unable to load student."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!student) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>
          Student not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.name}>
          {student.full_name}
        </Text>

        <Text style={styles.label}>
          Class
        </Text>
        <Text style={styles.value}>
          {student.class ?? "-"}
        </Text>

        <Text style={styles.label}>
          Roll Number
        </Text>
        <Text style={styles.value}>
          {student.roll_no ?? "-"}
        </Text>

        <Text style={styles.label}>
          Email
        </Text>
        <Text style={styles.value}>
          {student.email ?? "-"}
        </Text>

        <Text style={styles.label}>
          Phone
        </Text>
        <Text style={styles.value}>
          {student.phone ?? "-"}
        </Text>

        <Text style={styles.label}>
          Parent
        </Text>
        <Text style={styles.value}>
          {student.parent_name ?? "-"}
        </Text>

        <Text style={styles.label}>
          Parent Phone
        </Text>
        <Text style={styles.value}>
          {student.parent_phone ?? "-"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },

  label: {
    marginTop: 16,
    fontWeight: "700",
    color: "#64748B",
  },

  value: {
    marginTop: 6,
    fontSize: 17,
    color: "#111827",
  },
});