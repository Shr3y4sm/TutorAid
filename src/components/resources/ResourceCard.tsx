import { Pressable, StyleSheet, Text, View } from "react-native";
import { Resource } from "@/types/resource";

interface Props {
  resource: Resource;
  onPress: () => void;
}

export default function ResourceCard({
  resource,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <Text style={styles.title}>
        {resource.title}
      </Text>

      <Text style={styles.subject}>
        {resource.subject}
      </Text>

      <Text numberOfLines={2}>
        {resource.description}
      </Text>

      <Text style={styles.footer}>
        {resource.file_name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  subject: {
    marginTop: 4,
    color: "#666",
    marginBottom: 8,
  },
  footer: {
    marginTop: 12,
    fontSize: 12,
    color: "#888",
  },
});