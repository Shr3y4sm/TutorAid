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

import {
  getAttendanceSummary,
  getStudentAttendance,
} from "@/api/attendance";

import AttendanceSummary from "@/features/attendance/components/AttendanceSummary";

import {
  Attendance,
  AttendanceSummary as AttendanceSummaryType,
} from "@/types/attendance";

import { getCurrentStudentId } from "@/services/studentService";

export default function AttendanceScreen() {
  const [summary, setSummary] = useState<AttendanceSummaryType>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    percentage: 0,
  });

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAttendance = async () => {
    try {
      setError("");

      const studentId = await getCurrentStudentId();

      const [summaryData, attendanceData] = await Promise.all([
        getAttendanceSummary(studentId),
        getStudentAttendance(studentId),
      ]);

      setSummary(summaryData);
      setAttendance(attendanceData);
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
        <Text style={styles.message}>Loading attendance...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.error}>{error}</Text>
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
        <Text style={styles.heading}>Attendance</Text>

        <AttendanceSummary
          overall={summary.percentage}
          attended={summary.present}
          missed={summary.absent + summary.leave}
        />

        <Text style={styles.sectionTitle}>Attendance History</Text>

        {attendance.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.message}>
              No attendance records found.
            </Text>
          </View>
        ) : (
          attendance.map((record) => (
            <View
              key={record.id}
              style={styles.historyCard}
            >
              <Text style={styles.historyDate}>
                {new Date(record.attendance_date).toLocaleDateString()}
              </Text>

              <Text style={styles.historyStatus}>
                {record.status}
              </Text>

              {record.remarks ? (
                <Text style={styles.historyRemarks}>
                  {record.remarks}
                </Text>
              ) : null}
            </View>
          ))
        )}

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
    marginTop: 10,
    marginBottom: 15,
    color: "#111827",
  },

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
  },

  historyCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  historyDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  historyStatus: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },

  historyRemarks: {
    marginTop: 6,
    color: "#64748B",
    fontSize: 14,
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