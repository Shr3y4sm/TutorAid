import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";

import Header from "@/features/student/components/dashboard/Header";
import AttendanceCard from "@/features/student/components/dashboard/AttendanceCard";
import QuickActions from "@/features/student/components/dashboard/QuickActions";
import ClassCard from "@/features/student/components/dashboard/ClassCard";
import AnnouncementCard from "@/features/student/components/dashboard/AnnouncementCard";

import { router } from "expo-router";

import { getStudentDashboard } from "@/api/student";
import { getCurrentStudentId } from "@/services/studentService";

export default function HomeScreen() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentId, setStudentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const id = await getCurrentStudentId();

      setStudentId(id);

      const data = await getStudentDashboard(id);

      setDashboard(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  /** Joins the live meeting linked to a scheduled class. */
  async function joinLiveClass(
    meetCode: string,
    subject: string
  ) {
    const name =
      dashboard?.student?.full_name ??
      "Student";

    let entityId = studentId ?? "";

    if (!entityId) {
      try {
        entityId =
          await getCurrentStudentId();
      } catch {
        entityId = "";
      }
    }

    router.push({
      pathname: "/(video)/call",
      params: {
        classname: meetCode,
        username: name,
        role: "student",
        entityId,
        subject,
      },
    });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  if (error || !dashboard) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "No dashboard data available."}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDashboard}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Header
        name={dashboard.student?.full_name ?? "Student"}
        subtitle={`Semester ${dashboard.student?.semester ?? "-"}`}
      />

      <AttendanceCard
        attendance={dashboard.attendance}
      />

      <Text style={styles.section}>
        Quick Actions
      </Text>

      <QuickActions />

      <Text style={styles.section}>
        Today's Classes
      </Text>

      {(dashboard.todaysClasses ?? []).map((item: any) => (
        <ClassCard
          key={item.id}
          subject={item.subject}
          teacher="Faculty"
          room={item.room}
          time={`${item.start_time} - ${item.end_time}`}
          onJoin={
            item.call_id
              ? () =>
                  joinLiveClass(
                    item.call_id,
                    item.subject
                  )
              : undefined
          }
        />
      ))}

      <Text style={styles.section}>
        Announcements
      </Text>

      {(dashboard.announcements ?? []).map((item: any) => (
        <AnnouncementCard
          key={item.id}
          title={item.title}
          description={item.description}
          date={new Date(
            item.created_at
          ).toLocaleDateString()}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
  },

  section: {
    marginTop: 20,
    marginBottom: 14,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.2,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 16,
  },

  errorText: {
    color: "#EF4444",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },

  retryButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});