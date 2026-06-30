import { View, Text, StyleSheet } from "react-native";

type Props = {
  subject: string;
  time: string;
  teacher: string;
};

export default function ClassCard({
  subject,
  time,
  teacher,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.subject}>{subject}</Text>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.teacher}>{teacher}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },
  subject: {
    fontSize: 18,
    fontWeight: "700",
  },
  time: {
    color: "#2563EB",
    marginTop: 6,
    fontWeight: "600",
  },
  teacher: {
    marginTop: 6,
    color: "#64748B",
  },
});