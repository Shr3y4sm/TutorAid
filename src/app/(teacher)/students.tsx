import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import Colors from "@/theme/colors";

import { getTeacherStudents } from "@/api/teacherStudents";

import StudentCard from "@/features/teacher/students/components/StudentCard";

import { TeacherStudent } from "@/features/teacher/students/types/student";

export default function StudentsScreen() {
  const [students, setStudents] =
    useState<TeacherStudent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const data =
        await getTeacherStudents();

      setStudents(data);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return students.filter((student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [students, search]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Students
      </Text>

      <TextInput
        placeholder="Search students..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <StudentCard student={item} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: Colors.text,
  },

  search: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
});