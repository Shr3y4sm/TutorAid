import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/theme/colors";
import Typography from "@/theme/typography";
import Spacing from "@/theme/spacing";

interface Props {
  text: string;
}

export default function TeacherActivityCard({
  text,
}: Props) {
  return (
    <View style={styles.card}>
      <Ionicons
        name="checkmark-circle"
        size={22}
        color={Colors.primary}
      />

      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 14,
    marginBottom: 10,
  },

  text: {
    marginLeft: 10,
    flex: 1,
    color: Colors.text,
    fontSize: Typography.body,
  },
});