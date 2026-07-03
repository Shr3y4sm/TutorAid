import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";

import Colors from "@/theme/colors";
import Typography from "@/theme/typography";

import { getNotifications } from "@/api/notifications";

import NotificationCard from "@/features/notifications/components/NotificationCard";

import { Notification } from "@/features/notifications/types/notification";

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data =
          await getNotifications();

        setNotifications(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
        />
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
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <NotificationCard
            {...item}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    fontSize: Typography.h1,
    fontWeight: Typography.bold,
    color: Colors.text,
    marginBottom: 20,
  },
});