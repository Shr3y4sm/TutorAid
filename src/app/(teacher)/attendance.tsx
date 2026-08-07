import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
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

  const [saving, setSaving] =
    useState(false);

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

  function toggle(id: string) {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, present: !s.present }
          : s
      )
    );
  }

  function markAllPresent() {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        present: true,
      }))
    );
  }

  async function saveAttendance() {
    const teacherId =
      await getCurrentTeacherId();

    setSaving(true);

    try {
      for (const student of students) {
        await markAttendance({
          id: student.id,
          present: student.present,
          marked_by: teacherId,
        });
      }

      Alert.alert(
        "Success",
        "Attendance saved successfully."
      );
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        "Unable to save attendance."
      );
    } finally {
      setSaving(false);
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

      <Text style={styles.subheading}>
        Mark students as present or absent
      </Text>

      <TouchableOpacity
        style={styles.markAllButton}
        onPress={markAllPresent}
      >
        <Text style={styles.markAllText}>
          ✓ Mark All Present
        </Text>
      </TouchableOpacity>

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

      <TouchableOpacity
        style={[
          styles.saveButton,
          saving && styles.saveButtonDisabled,
        ]}
        onPress={saveAttendance}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>
          {saving ? "Saving..." : "Save Attendance"}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 4,
  },

  subheading: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 16,
  },

  markAllButton: {
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  markAllText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 15,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
    fontSize: 16,
  },

  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
