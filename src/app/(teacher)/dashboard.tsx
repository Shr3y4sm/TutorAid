import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getTeacherDashboard } from "@/api/teacher";
import { TeacherDashboardData } from "@/features/teacher/types/teacher";

import TeacherStatCard from "@/features/teacher/components/TeacherStatCard";
import TeacherQuickAction from "@/features/teacher/components/TeacherQuickAction";
import TeacherClassCard from "@/features/teacher/components/TeacherClassCard";
import TeacherActivityCard from "@/features/teacher/components/TeacherActivityCard";

import Colors from "@/theme/colors";
import { router } from "expo-router";

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
  console.log("1 - Starting request");

  try {
    const data = await Promise.race([
      getTeacherDashboard(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request Timeout")), 5000)
      ),
    ]);

    console.log("2 - Success", data);

    setDashboard(data as TeacherDashboardData);
  } catch (err: any) {
    console.log("3 - Error", err);
    setError(err?.message ?? String(err));
  } finally {
    console.log("4 - Finished");
    setLoading(false);
  }
}

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12 }}>
          Loading dashboard...
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
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          Dashboard Error
        </Text>

        <Text
          style={{
            marginTop: 10,
            textAlign: "center",
            paddingHorizontal: 20,
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
        <Text>No dashboard data.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.greeting}>👋 Good Morning</Text>

      <Text style={styles.name}>
        {dashboard.teacher.name}
      </Text>

      <Text style={styles.subject}>
        {dashboard.teacher.subject}
      </Text>

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
          value={dashboard.stats.pendingAssignments}
        />
        <TeacherStatCard
          title="Attendance"
          value={`${dashboard.stats.attendanceToday}%`}
        />
      </View>

     <Text style={styles.heading}>
  Quick Actions
</Text>

<Text>Quick Actions Disabled</Text>

      <View style={styles.actions}>
        {dashboard.quickActions.map((item) => (
          <TeacherQuickAction
            key={item.id}
            title={item.title}
            icon={item.icon as any}
            onPress={() => {
              switch (item.title) {
                case "Students":
                  router.push("/(teacher)/students");
                  break;
                case "Assignments":
                  router.push("/(teacher)/assignments");
                  break;
                case "Attendance":
                  router.push("/(teacher)/attendance");
                  break;
                case "Schedule":
                  router.push("/(teacher)/schedule");
                  break;
                case "AI Assistant":
                  router.push("/(teacher)/ai");
                  break;
              }
            }}
          />
        ))}
      </View>

      <Text style={styles.heading}>Today's Classes</Text>

      {dashboard.todayClasses.map((item) => (
        <TeacherClassCard
          key={item.id}
          {...item}
        />
      ))}

      <Text style={styles.heading}>Recent Activity</Text>

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