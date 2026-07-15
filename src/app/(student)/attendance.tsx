import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAttendance } from "@/api/attendance";

import AttendanceSummary from "@/features/attendance/components/AttendanceSummary";
import SubjectAttendanceRow from "@/features/attendance/components/SubjectAttendanceRow";

import { AttendanceData } from "@/features/attendance/types/attendance";
import { getCurrentStudentId } from "@/services/studentService";
export default function AttendanceScreen() {
  const [attendance, setAttendance] =
    useState<AttendanceData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadAttendance() {
    try {
      setError("");

      const studentId =
  await getCurrentStudentId();

const data =
  await getAttendance(studentId);

      setAttendance(data);
    } catch {
      setError("Failed to load attendance.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAttendance();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.message}>
          Loading attendance...
        </Text>
      </SafeAreaView>
    );
  }

  if (error.length > 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  if (!attendance) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.message}>
          No attendance available.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <Text style={styles.heading}>
          Attendance
        </Text>

        <AttendanceSummary
          overall={attendance.overallPercentage}
          attended={attendance.attendedClasses}
          missed={attendance.missedClasses}
        />

        <Text style={styles.sectionTitle}>
          Subject Wise Attendance
        </Text>

        {attendance.subjects.map((subject) => (
          <SubjectAttendanceRow
            key={subject.id}
            subject={subject.subject}
            attended={subject.attended}
            total={subject.total}
            percentage={subject.percentage}
          />
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    marginTop: 10,
    color: "#111827",
  },

  message: {
    marginTop: 15,
    color: "#64748B",
    fontSize: 16,
  },

  error: {
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "600",
  },
});