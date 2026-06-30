import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress?: () => void;
};

export default function QuickActionCard({
  title,
  icon,
  color,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons
        name={icon}
        size={34}
        color={color}
      />

      <Text style={styles.title}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
  },

  title: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});