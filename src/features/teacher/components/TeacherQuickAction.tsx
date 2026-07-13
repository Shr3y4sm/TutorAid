import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/theme/colors";
import Typography from "@/theme/typography";
import Spacing from "@/theme/spacing";

interface Props {
  title: string;
  icon: string;
  onPress?: () => void;
}

const iconMap: Record<
  string,
  keyof typeof Ionicons.glyphMap
> = {
  videocam: "videocam-outline",
  people: "people-outline",
  "document-text": "document-text-outline",
  calendar: "calendar-outline",
  sparkles: "sparkles-outline",
};

export default function TeacherQuickAction({
  title,
  icon,
  onPress,
}: Props) {
  const iconName =
    iconMap[icon] ?? "ellipse-outline";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <Ionicons
        name={iconName}
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