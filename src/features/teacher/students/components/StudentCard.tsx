import { View, Text, StyleSheet } from "react-native";

import Colors from "@/theme/colors";
import Spacing from "@/theme/spacing";
import Typography from "@/theme/typography";

import { TeacherStudent } from "../types/student";

interface Props {
  student: TeacherStudent;
}

export default function StudentCard({ student }: Props) {
  function getStatusColor() {
    switch (student.status) {
      case "Active":
        return "#16A34A";
      case "Warning":
        return "#F59E0B";
      case "Critical":
        return "#DC2626";
      default:
        return Colors.primary;
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{student.name}</Text>

        <View
          style={[
            styles.status,
            { backgroundColor: getStatusColor() },
          ]}
        >
          <Text style={styles.statusText}>
            {student.status}
          </Text>
        </View>
      </View>

      <Text style={styles.info}>
        Roll No : {student.rollNo}
      </Text>

      <Text style={styles.info}>
        Course : {student.course}
      </Text>

      <Text style={styles.info}>
        Year : {student.year}
      </Text>

      <Text style={styles.attendance}>
        Attendance : {student.attendance}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.text,
  },

  status: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  info: {
    marginTop: 6,
    color: Colors.textSecondary,
  },

  attendance: {
    marginTop: 10,
    fontWeight: "700",
    color: Colors.primary,
  },
});