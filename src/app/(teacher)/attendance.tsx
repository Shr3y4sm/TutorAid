import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";

import {
  getTeacherAttendance,
  markAttendance,
} from "@/api/teacherAttendance";

import AttendanceStudentCard from "@/features/teacher/attendance/components/AttendanceStudentCard";
import {
  TeacherAttendance,
} from "@/features/teacher/attendance/types/attendance";

import { getCurrentTeacherId } from "@/services/teacherService";
import Colors from "@/theme/colors";

export default function TeacherAttendanceScreen() {
  const [students, setStudents] =
    useState<TeacherAttendance[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const teacherId =
        await getCurrentTeacherId();

      const data =
        await getTeacherAttendance(
          teacherId
        );

      setStudents(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function toggle(id: string) {
    const teacherId =
      await getCurrentTeacherId();

    const updated = students.map((s) =>
      s.id === id
        ? {
            ...s,
            present: !s.present,
          }
        : s
    );

    setStudents(updated);

    const student =
      updated.find(
        (s) => s.id === id
      );

    if (!student) return;

    try {
      await markAttendance({
        id,
        present: student.present,
        marked_by: teacherId,
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        Attendance
      </Text>

      <FlatList
  data={students}
  keyExtractor={(item) => item.id.toString()}
  ListEmptyComponent={
    <Text style={styles.empty}>
      No students found.
    </Text>
  }
  renderItem={({ item }) => (
    <AttendanceStudentCard
      name={item.name}
      rollNo={item.rollNo}
      present={item.present}
      onToggle={() => toggle(item.id)}
    />
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

  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
    fontSize: 16,
  },
});