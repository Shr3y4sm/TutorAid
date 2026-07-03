import { View, Text, StyleSheet } from "react-native";

interface Props {
  overall: number;
  attended: number;
  missed: number;
}

export default function AttendanceSummary({
  overall,
  attended,
  missed,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Overall Attendance</Text>

      <Text style={styles.percentage}>
        {overall}%
      </Text>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Attended</Text>
          <Text style={styles.value}>{attended}</Text>
        </View>

        <View>
          <Text style={styles.label}>Missed</Text>
          <Text style={styles.value}>{missed}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  percentage: {
    fontSize: 42,
    fontWeight: "800",
    color: "#2563EB",
    marginVertical: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#64748B",
  },

  value: {
    fontSize: 22,
    fontWeight: "700",
  },
});