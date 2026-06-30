import { ScrollView, Text, StyleSheet } from "react-native";

import Header from "@/features/student/components/dashboard/Header";
import AttendanceCard from "@/features/student/components/dashboard/AttendanceCard";
import QuickActions from "@/features/student/components/dashboard/QuickActions";
import ClassCard from "@/features/student/components/dashboard/ClassCard";
import AnnouncementCard from "@/features/student/components/dashboard/AnnouncementCard";

import {
  announcements,
  todaysClasses,
} from "@/features/student/data/dashboard";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Header
        name="Shreyas"
        subtitle="AIML • 3rd Year"
      />

      <AttendanceCard />

      <Text style={styles.section}>
        Quick Actions
      </Text>

      <QuickActions />

      <Text style={styles.section}>
        Today's Classes
      </Text>

      {todaysClasses.map((item) => (
        <ClassCard
          key={item.id}
          subject={item.subject}
          teacher={item.teacher}
          room={item.room}
          time={item.time}
        />
      ))}

      <Text style={styles.section}>
        Announcements
      </Text>

      {announcements.map((item) => (
        <AnnouncementCard
          key={item.id}
          title={item.title}
          description={item.description}
          date={item.date}
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