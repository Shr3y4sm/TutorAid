import React, { useEffect, useState } from "react";
import {
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
import { getCurrentTeacherId } from "@/services/teacherService";
import {
  TeacherAttendance,
} from "@/features/teacher/attendance/types/attendance";

import Colors from "@/theme/colors";

export default function TeacherAttendanceScreen() {
  const [students, setStudents] =
    useState<TeacherAttendance[]>([]);

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
    console.error(err);
  }
}

  async function toggle(id: number) {
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
      updated.find((s) => s.id === id)!;

    await markAttendance(
      id,
      student.present
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        Attendance
      </Text>

      <FlatList
        data={students}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <AttendanceStudentCard
            name={item.name}
            rollNo={item.rollNo}
            present={item.present}
            onToggle={() =>
              toggle(item.id)
            }
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

  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
});