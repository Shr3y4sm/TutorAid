import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  description: string;
  date: string;
};

export default function AnnouncementCard({
  title,
  description,
  date,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <Text style={styles.date}>
        {date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 2,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    marginTop: 8,
    color: "#64748B",
    lineHeight: 22,
  },

  date: {
    marginTop: 10,
    color: "#2563EB",
    fontWeight: "600",
  },
});