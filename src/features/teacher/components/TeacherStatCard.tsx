import { View, Text, StyleSheet } from "react-native";

import Colors from "@/theme/colors";
import Typography from "@/theme/typography";
import Spacing from "@/theme/spacing";

interface Props {
  title: string;
  value: string | number;
}

export default function TeacherStatCard({
  title,
  value,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    margin: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  value: {
    fontSize: 28,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },

  title: {
    marginTop: 8,
    fontSize: Typography.small,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});