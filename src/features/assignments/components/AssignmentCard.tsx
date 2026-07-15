import { View, Text, StyleSheet } from "react-native";
import Colors from "@/theme/colors";
import { TeacherAssignment } from "@/features/teacher/assignments/types/assignment";

interface Props {
  assignment: TeacherAssignment;
}

export default function AssignmentCard({
  assignment,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {assignment.title}
      </Text>

      <Text style={styles.subject}>
        {assignment.subject}
      </Text>

      <Text>
        Due: {assignment.due_date}
      </Text>

      <Text>
        Max Marks: {assignment.max_marks}
      </Text>

      <Text style={styles.status}>
        {assignment.status}
      </Text>

      {assignment.description ? (
        <Text style={styles.description}>
          {assignment.description}
        </Text>
      ) : null}
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

  title: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
    color: Colors.text,
  },

  subject: {
    color: Colors.textSecondary,
    marginBottom: 8,
  },

  status: {
    marginTop: 10,
    color: Colors.primary,
    fontWeight: "700",
  },

  description: {
    marginTop: 8,
    color: Colors.textSecondary,
  },
});