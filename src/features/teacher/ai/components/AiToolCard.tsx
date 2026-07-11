import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Colors from "@/theme/colors";

interface Props {
  title: string;
  description: string;
  onPress: () => void;
}

export default function AiToolCard({
  title,
  description,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },

  description: {
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});