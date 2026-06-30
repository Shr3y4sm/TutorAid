import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type HeaderProps = {
  name: string;
  subtitle: string;
};

export default function Header({
  name,
  subtitle,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>
          👋 Good Morning
        </Text>

        <Text style={styles.name}>
          {name}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      <TouchableOpacity style={styles.notification}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#111827"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    fontSize: 16,
    color: "#6B7280",
  },

  name: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },

  subtitle: {
    marginTop: 4,
    color: "#64748B",
    fontSize: 15,
  },

  notification: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
});