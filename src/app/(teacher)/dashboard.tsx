import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Share,
  TouchableOpacity,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";

import Colors from "@/theme/colors";

import { getTeacherDashboard } from "@/api/teacher";
import { startMeeting } from "@/api/meetings";
import { ApiError } from "@/api/client";

import { getCurrentTeacherId } from "@/services/teacherService";

import {
  TeacherDashboardData,
} from "@/features/teacher/types/teacher";

import TeacherStatCard from "@/features/teacher/components/TeacherStatCard";
import TeacherQuickAction from "@/features/teacher/components/TeacherQuickAction";
import TeacherClassCard from "@/features/teacher/components/TeacherClassCard";
import TeacherActivityCard from "@/features/teacher/components/TeacherActivityCard";

export default function TeacherDashboard() {
  const [dashboard, setDashboard] =
    useState<TeacherDashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // -------------------------------------------------------------------
  // Prevent infinite 401 → redirect → re-render → 401 loops.
  // If the redirect has already been triggered once we bail out instead
  // of repeatedly firing router.replace.
  // -------------------------------------------------------------------
  const redirecting = useRef(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getTeacherDashboard();
      setDashboard(data);
    } catch (err: any) {
      console.error(err);

      // -----------------------------------------------------------------
      // 401 handling — session expired or token is invalid.
      // Redirect to login, but only once (ref guard).
      // -----------------------------------------------------------------
      if (
        err instanceof ApiError &&
        err.statusCode === 401
      ) {
        if (!redirecting.current) {
          redirecting.current = true;
          router.replace("/(auth)/login");
        }

        return;
      }

      setError(err?.message ?? "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>
          Loading Dashboard...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text
          style={{
            color: "red",
            fontSize: 20,
            fontWeight: "700",
            textAlign: "center",
            paddingHorizontal: 24,
          }}
        >
          {error}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError("");
            load();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!dashboard) {
    return (
      <View style={styles.center}>
        <Text>No Dashboard Data</Text>
      </View>
    );
  }

  const teacher = dashboard.teacher ?? {};
  const stats = dashboard.stats ?? {};
  const quickActions = dashboard.quickActions ?? [];
  const todayClasses = dashboard.todayClasses ?? [];
  const recentActivity = dashboard.recentActivity ?? [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>
        👋 Good Morning
      </Text>

      <Text style={styles.name}>
        {teacher.name ?? "Teacher"}
      </Text>

      <Text style={styles.subject}>
        {teacher.subject ?? ""}
      </Text>
      {/* Teacher Code */}

      <View style={styles.codeCard}>
        <Text style={styles.codeTitle}>
          Your Teacher Code
        </Text>

        <Text style={styles.code}>
          {teacher.teacherCode ?? "-"}
        </Text>

        <View style={styles.codeButtons}>
          <TouchableOpacity
            style={styles.codeButton}
            onPress={async () => {
              await Clipboard.setStringAsync(
                teacher.teacherCode ?? ""
              );
            }}
          >
            <Text style={styles.codeButtonText}>
              Copy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.codeButton}
            onPress={() =>
              Share.share({
                message:
                  `Join my TutorAid classroom!\n\nTeacher Code: ${teacher.teacherCode ?? ""}`,
              })
            }
          >
            <Text style={styles.codeButtonText}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}

      <View style={styles.stats}>
        <TeacherStatCard
          title="Today's Classes"
          value={stats.todayClasses ?? 0}
        />

        <TeacherStatCard
          title="Students"
          value={stats.totalStudents ?? 0}
        />
      </View>

      <View style={styles.stats}>
        <TeacherStatCard
          title="Assignments"
          value={
            stats.pendingAssignments ?? 0
          }
        />

        <TeacherStatCard
          title="Attendance"
          value={`${stats.attendanceToday ?? 0}%`}
        />
      </View>

      {/* Quick Actions */}

      <Text style={styles.heading}>
        Quick Actions
      </Text>

      <View style={styles.actions}>
        {quickActions.map((item: any) => (
          <TeacherQuickAction
            key={item.id}
            title={item.title}
            icon={item.icon as any}
            onPress={async () => {
              switch (item.title) {
                case "Start Class": {
                  const teacherId = await getCurrentTeacherId();
                  try {
                    const meeting = await startMeeting({
                      teacher_id: teacherId,
                      subject: teacher.subject ?? "Live Class",
                    });

                    router.push({
                      pathname: "/(video)/call",
                      params: {
                        classname: meeting.meet_code,
                        username: teacher.name ?? "Teacher",
                        role: "teacher",
                        entityId: teacherId,
                      },
                    });
                  } catch (err) {
                    console.warn(
                      "Meeting session could not be created — " +
                        "starting video call without attendance tracking.",
                      err
                    );
                    // Graceful fallback: if the /meetings backend or DB tables
                    // aren't available yet, still start the video call using
                    // the teacher's existing code so the app keeps working.
                    // Attendance auto-marking simply won't happen this session.
                    router.push({
                      pathname: "/(video)/call",
                      params: {
                        classname:
                          teacher.teacherCode ?? teacherId,
                        username: teacher.name ?? "Teacher",
                        role: "teacher",
                        entityId: teacherId,
                      },
                    });
                  }
                  break;
                }

                case "Students":
                  router.push(
                    "/(teacher)/students"
                  );
                  break;

                case "Assignments":
                  router.push(
                    "/(teacher)/assignments"
                  );
                  break;

                case "Attendance":
                  router.push(
                    "/(teacher)/attendance"
                  );
                  break;

                case "Schedule":
                  router.push(
                    "/(teacher)/schedule"
                  );
                  break;

                case "AI Assistant":
                  router.push(
                    "/(teacher)/ai"
                  );
                  break;

                case "Resources":
                  router.push(
                    "/(teacher)/resources"
                  );
                  break;
              }
            }}
          />
        ))}
      </View>

      {/* Today's Classes */}

      <Text style={styles.heading}>
        Today's Classes
      </Text>

      {todayClasses.map((item: any) => (
        <TeacherClassCard
          key={item.id}
          {...item}
        />
      ))}

      {/* Recent Activity */}

      <Text style={styles.heading}>
        Recent Activity
      </Text>

      {recentActivity.map((item: any) => (
        <TeacherActivityCard
          key={item.id}
          text={item.text}
        />
      ))}
    </ScrollView>
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

  greeting: {
    color: "#6B7280",
    fontSize: 16,
  },

  name: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 4,
  },

  subject: {
    marginTop: 4,
    color: "#64748B",
    marginBottom: 20,
  },

  codeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    elevation: 3,
  },

  codeTitle: {
    color: "#64748B",
    fontSize: 15,
  },

  code: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 2,
    color: Colors.primary,
  },

  codeButtons: {
    flexDirection: "row",
    marginTop: 18,
  },

  codeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 12,
  },

  codeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  heading: {
    marginTop: 22,
    marginBottom: 14,
    fontSize: 22,
    fontWeight: "700",
  },

  stats: {
    flexDirection: "row",
  },

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  retryButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
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