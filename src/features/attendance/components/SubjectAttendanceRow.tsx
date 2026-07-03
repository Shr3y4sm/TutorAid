import { View, Text, StyleSheet } from "react-native";

import AttendanceProgress from "./AttendanceProgress";

interface Props {
  subject: string;
  attended: number;
  total: number;
  percentage: number;
}

export default function SubjectAttendanceRow({
  subject,
  attended,
  total,
  percentage,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.subject}>
          {subject}
        </Text>

        <Text style={styles.percent}>
          {percentage}%
        </Text>
      </View>

      <AttendanceProgress
        percentage={percentage}
      />

      <Text style={styles.count}>
        {attended}/{total} Classes
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  subject: {
    fontWeight: "700",
    fontSize: 16,
  },

  percent: {
    fontWeight: "700",
    color: "#2563EB",
  },

  count: {
    marginTop: 10,
    color: "#64748B",
  },
});