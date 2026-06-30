import { View, Text, StyleSheet } from "react-native";

type Props = {
  subject: string;
  teacher: string;
  time: string;
  room: string;
};

export default function ClassCard({
  subject,
  teacher,
  time,
  room,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.subject}>
          {subject}
        </Text>

        <Text style={styles.teacher}>
          {teacher}
        </Text>

        <Text style={styles.room}>
          {room}
        </Text>
      </View>

      <View>
        <Text style={styles.time}>
          {time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },

  left: {
    flex: 1,
  },

  subject: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  teacher: {
    marginTop: 5,
    color: "#64748B",
  },

  room: {
    marginTop: 3,
    color: "#94A3B8",
  },

  time: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563EB",
  },
});