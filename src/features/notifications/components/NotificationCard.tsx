import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "@/theme/colors";
import Spacing from "@/theme/spacing";
import Typography from "@/theme/typography";

interface Props {
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function icon(type: string) {
  switch (type) {
    case "assignment":
      return "document-text";

    case "course":
      return "book";

    case "attendance":
      return "checkmark-circle";

    case "announcement":
      return "megaphone";

    default:
      return "notifications";
  }
}

export default function NotificationCard({
  type,
  title,
  message,
  time,
  read,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        !read && styles.unread,
      ]}
    >
      <Ionicons
        name={icon(type)}
        size={26}
        color={Colors.primary}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.message}>
          {message}
        </Text>

        <Text style={styles.time}>
          {time}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 14,
    marginBottom: Spacing.lg,
  },

  unread: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },

  content: {
    flex: 1,
    marginLeft: Spacing.lg,
  },

  title: {
    fontSize: Typography.body,
    fontWeight: Typography.bold,
    color: Colors.text,
  },

  message: {
    marginTop: 6,
    color: Colors.textSecondary,
  },

  time: {
    marginTop: 8,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },
});