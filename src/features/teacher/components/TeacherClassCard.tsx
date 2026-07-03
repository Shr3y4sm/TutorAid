import { View, Text, StyleSheet } from "react-native";

import Colors from "@/theme/colors";
import Typography from "@/theme/typography";
import Spacing from "@/theme/spacing";

interface Props {
  subject: string;
  section: string;
  room: string;
  time: string;
}

export default function TeacherClassCard({
  subject,
  section,
  room,
  time,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.subject}>
        {subject}
      </Text>

      <Text style={styles.info}>
        {section} • {room}
      </Text>

      <Text style={styles.time}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 14,
    marginBottom: 12,
  },

  subject: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.text,
  },

  info: {
    marginTop: 5,
    color: Colors.textSecondary,
  },

  time: {
    marginTop: 8,
    color: Colors.primary,
    fontWeight: "600",
  },
});