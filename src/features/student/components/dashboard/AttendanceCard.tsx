import { View, Text, StyleSheet } from "react-native";

export default function AttendanceCard() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>
          Attendance
        </Text>

        <Text style={styles.percent}>
          91%
        </Text>
      </View>

      <View style={styles.progressBackground}>
        <View style={styles.progressFill} />
      </View>

      <Text style={styles.footer}>
        Excellent! Keep it above 85%.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2563EB",
    borderRadius: 24,
    padding: 22,
    marginBottom: 25,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  percent: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
  },

  progressBackground: {
    marginTop: 18,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },

  progressFill: {
    width: "91%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },

  footer: {
    color: "white",
    marginTop: 15,
    opacity: 0.9,
  },
});