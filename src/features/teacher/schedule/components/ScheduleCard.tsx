import { View, Text, StyleSheet } from "react-native";
import Colors from "@/theme/colors";
import { TeacherSchedule } from "../types/schedule";

interface Props {
  schedule: TeacherSchedule;
}

export default function ScheduleCard({
  schedule,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.subject}>
        {schedule.subject}
      </Text>

      <Text>
        {schedule.section} • {schedule.room}
      </Text>

      <Text>
        {schedule.start_time} - {schedule.end_time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  subject: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
  },
});