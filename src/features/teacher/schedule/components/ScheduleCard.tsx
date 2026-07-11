import { View, Text, StyleSheet } from "react-native";

import Colors from "@/theme/colors";

interface Props {
  subject: string;
  section: string;
  room: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function ScheduleCard({
  subject,
  section,
  room,
  startTime,
  endTime,
  status,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.subject}>
        {subject}
      </Text>

      <Text>
        {section} • {room}
      </Text>

      <Text>
        {startTime} - {endTime}
      </Text>

      <Text style={styles.status}>
        {status}
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

  status: {
    marginTop: 10,
    color: Colors.primary,
    fontWeight: "700",
  },
});