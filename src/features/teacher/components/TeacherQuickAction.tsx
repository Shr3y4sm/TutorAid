import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/theme/colors";
import Typography from "@/theme/typography";
import Spacing from "@/theme/spacing";

interface Props {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export default function TeacherQuickAction({
  title,
  icon,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={28}
        color={Colors.primary}
      />

      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "30%",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: "center",
    marginBottom: 12,
  },

  text: {
    marginTop: 8,
    textAlign: "center",
    fontSize: Typography.small,
    color: Colors.text,
    fontWeight: "600",
  },
});