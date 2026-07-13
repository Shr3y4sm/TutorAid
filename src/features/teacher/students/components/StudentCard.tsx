import { View, Text, StyleSheet } from "react-native";

import Colors from "@/theme/colors";
import Spacing from "@/theme/spacing";
import Typography from "@/theme/typography";

import { TeacherStudent } from "../types/student";

interface Props {
  student: TeacherStudent;
}

export default function StudentCard({ student }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>
        {student.full_name}
      </Text>

      <Text style={styles.info}>
        Roll No: {student.roll_no}
      </Text>

      <Text style={styles.info}>
        Course: {student.course ?? "Not Assigned"}
      </Text>

      <Text style={styles.info}>
        Year: {student.year ?? "-"}
      </Text>

      <Text style={styles.info}>
        Semester: {student.semester ?? "-"}
      </Text>

      <Text style={styles.info}>
        Section: {student.section ?? "-"}
      </Text>

      <Text style={styles.info}>
        Email: {student.email ?? "-"}
      </Text>

      <Text style={styles.info}>
        Phone: {student.phone ?? "-"}
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

  name: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },

  info: {
    marginTop: 4,
    color: Colors.textSecondary,
  },
});