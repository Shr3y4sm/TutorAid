import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { getNotifications } from "@/api/notifications";
import { getCurrentStudentId } from "@/services/studentService";
type HeaderProps = {
  name: string;
  subtitle: string;
};

export default function Header({
  name,
  subtitle,
}: HeaderProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

 async function loadNotifications() {
  try {
    const studentId = await getCurrentStudentId();

    const notifications = await getNotifications(studentId);

    const unread = notifications.filter(
      (item) => !item.is_read
    ).length;

    setUnreadCount(unread);
  } catch (error) {
    console.error("Failed to load notifications:", error);
    setUnreadCount(0);
  }
}
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

      <TouchableOpacity
        style={styles.notification}
        onPress={() =>
          router.push("/(student)/notifications")
        }
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#111827"
        />

        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount}
            </Text>
          </View>
        )}
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
    position: "relative",
  },

  badge: {
    position: "absolute",
    right: 2,
    top: 2,
    backgroundColor: "#DC2626",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});