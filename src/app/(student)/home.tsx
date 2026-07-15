import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet } from "react-native";

import Header from "@/features/student/components/dashboard/Header";
import AttendanceCard from "@/features/student/components/dashboard/AttendanceCard";
import QuickActions from "@/features/student/components/dashboard/QuickActions";
import ClassCard from "@/features/student/components/dashboard/ClassCard";
import AnnouncementCard from "@/features/student/components/dashboard/AnnouncementCard";

import { getStudentDashboard } from "@/api/student";
import { getCurrentStudentId } from "@/services/studentService";

export default function HomeScreen() {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const studentId = await getCurrentStudentId();

      const data =
        await getStudentDashboard(studentId);

      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!dashboard) return null;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Header
        name={dashboard.student.full_name}
        subtitle={`Semester ${dashboard.student.semester ?? "-"}`}
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

      {dashboard.todaysClasses.map((item: any) => (
        <ClassCard
          key={item.id}
          subject={item.subject}
          teacher="Faculty"
          room={item.room}
          time={`${item.start_time} - ${item.end_time}`}
        />
      ))}

      <Text style={styles.section}>
        Announcements
      </Text>

      {dashboard.announcements.map((item: any) => (
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
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 20,
  },

  section: {
    marginTop: 20,
    marginBottom: 15,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
});