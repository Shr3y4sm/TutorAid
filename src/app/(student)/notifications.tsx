import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from "react-native";

import {
  getNotifications,
  markNotificationRead,
  Notification,
} from "@/api/notifications";

import { getCurrentStudentId } from "@/services/studentService";
import Colors from "@/theme/colors";

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const studentId =
        await getCurrentStudentId();

      const data =
        await getNotifications(studentId);

      setNotifications(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function read(id: string) {
    try {
      await markNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                is_read: true,
              }
            : n
        )
      );
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        Notifications
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No notifications.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              !item.is_read &&
                styles.unread,
            ]}
            onPress={() =>
              read(item.id)
            }
          >
            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.message}>
              {item.message}
            </Text>

            <Text style={styles.time}>
              {new Date(
                item.created_at
              ).toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
  },

  unread: {
    borderLeftWidth: 5,
    borderLeftColor:
      Colors.primary,
  },

  title: {
    fontWeight: "700",
    fontSize: 18,
  },

  message: {
    marginTop: 8,
    color: "#475569",
  },

  time: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 12,
  },
});