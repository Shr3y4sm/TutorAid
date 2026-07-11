import { View, Text, StyleSheet } from "react-native";

import Colors from "@/theme/colors";

interface Props {
  title: string;
  subject: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: string;
}

export default function AssignmentCard({
  title,
  subject,
  dueDate,
  submissions,
  totalStudents,
  status,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text>{subject}</Text>

      <Text>Due : {dueDate}</Text>

      <Text>
        Submitted : {submissions}/{totalStudents}
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

  title: {
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