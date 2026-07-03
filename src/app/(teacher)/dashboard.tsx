import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getTeacherDashboard } from "@/api/teacher";
import {
  TeacherDashboardData,
} from "@/features/teacher/types/teacher";

import TeacherStatCard from "@/features/teacher/components/TeacherStatCard";
import TeacherQuickAction from "@/features/teacher/components/TeacherQuickAction";
import TeacherClassCard from "@/features/teacher/components/TeacherClassCard";
import TeacherActivityCard from "@/features/teacher/components/TeacherActivityCard";

import Colors from "@/theme/colors";
import { router } from "expo-router";
export default function TeacherDashboard() {
  const [dashboard, setDashboard] =
    useState<TeacherDashboardData>();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data =
      await getTeacherDashboard();

    setDashboard(data);
  }

  if (!dashboard) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
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
          break;

        case "Schedule":
          break;

        case "AI Assistant":
          break;

        case "Start Class":
          break;
      }
    }}
  />
))}
      </View>

      <Text style={styles.heading}>
        Today's Classes
      </Text>

      {dashboard.todayClasses.map((item) => (
        <TeacherClassCard
          key={item.id}
          {...item}
        />
      ))}

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

  loader: {
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