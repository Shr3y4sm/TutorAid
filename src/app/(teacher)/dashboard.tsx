import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Share,
  TouchableOpacity,
  Alert,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";

import Colors from "@/theme/colors";

import { getTeacherDashboard } from "@/api/teacher";
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

  useEffect(() => {
    load();
  }, []);

  async function load() {
  try {
    const teacherId =
      await getCurrentTeacherId();

    const data =
      await getTeacherDashboard(
        teacherId
      );

    setDashboard(data);

  } catch (err: any) {
    console.log(err);
    setError(err.message);
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
          }}
        >
          {error}
        </Text>
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

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>
        👋 Good Morning
      </Text>

      <Text style={styles.name}>
        {dashboard.teacher.name}
      </Text>

      <Text style={styles.subject}>
        {dashboard.teacher.subject}
      </Text>
      {/* Teacher Code */}

      <View style={styles.codeCard}>
        <Text style={styles.codeTitle}>
          Your Teacher Code
        </Text>

        <Text style={styles.code}>
          {dashboard.teacher.teacherCode}
        </Text>

        <View style={styles.codeButtons}>
          <TouchableOpacity
            style={styles.codeButton}
            onPress={async () => {
              await Clipboard.setStringAsync(
                dashboard.teacher.teacherCode
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
                  `Join my TutorAid classroom!\n\nTeacher Code: ${dashboard.teacher.teacherCode}`,
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
          value={dashboard.stats.todayClasses}
        />

        <TeacherStatCard
          title="Students"
          value={dashboard.stats.totalStudents}
        />
      </View>

      <View style={styles.stats}>
        <TeacherStatCard
          title="Assignments"
          value={
            dashboard.stats.pendingAssignments
          }
        />

        <TeacherStatCard
          title="Attendance"
          value={`${dashboard.stats.attendanceToday}%`}
        />
      </View>

      {/* Quick Actions */}

      <Text style={styles.heading}>
        Quick Actions
      </Text>

      <View style={styles.actions}>
        {dashboard.quickActions.map((item) => (
          <TeacherQuickAction
            key={item.id}
            title={item.title}
            icon={item.icon as any}
            onPress={() => {
              switch (item.title) {
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
              }
            }}
          />
        ))}
      </View>

      {/* Today's Classes */}

      <Text style={styles.heading}>
        Today's Classes
      </Text>

      {dashboard.todayClasses.map((item) => (
        <TeacherClassCard
          key={item.id}
          {...item}
        />
      ))}

      {/* Recent Activity */}

      <Text style={styles.heading}>
        Recent Activity
      </Text>

      {dashboard.recentActivity.map((item) => (
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
});