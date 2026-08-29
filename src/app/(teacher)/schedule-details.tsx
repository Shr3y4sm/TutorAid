import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  router,
  useLocalSearchParams,
} from "expo-router";

import Colors from "@/theme/colors";
import { deleteSchedule } from "@/api/teacherSchedule";

export default function ScheduleDetailsScreen() {
  const params = useLocalSearchParams();

  const scheduleId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  function removeSchedule() {
    Alert.alert(
      "Cancel Class",
      "This class will be cancelled and your students will be notified automatically.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSchedule(
                String(scheduleId)
              );

              Alert.alert(
                "Deleted",
                "Schedule deleted successfully."
              );

              router.replace(
                "/(teacher)/schedule"
              );

            } catch (err: any) {
              console.log(err);

              Alert.alert(
                "Error",
                err?.message ??
                  "Unable to delete schedule."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Schedule Details
      </Text>

      <Text style={styles.label}>
        Subject
      </Text>

      <Text style={styles.value}>
        {params.subject}
      </Text>

      <Text style={styles.label}>
        Section
      </Text>

      <Text style={styles.value}>
        {params.section}
      </Text>

      <Text style={styles.label}>
        Room
      </Text>

      <Text style={styles.value}>
        {params.room}
      </Text>

      <Text style={styles.label}>
        Day
      </Text>

      <Text style={styles.value}>
        {params.day}
      </Text>

      <Text style={styles.label}>
        Start Time
      </Text>

      <Text style={styles.value}>
        {params.start_time}
      </Text>

      <Text style={styles.label}>
        End Time
      </Text>

      <Text style={styles.value}>
        {params.end_time}
      </Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname:
              "/(teacher)/edit-schedule",
            params,
          })
        }
      >
        <Text style={styles.buttonText}>
          Edit Schedule
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={removeSchedule}
      >
        <Text style={styles.buttonText}>
          Delete Schedule
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
  },

  label: {
    marginTop: 16,
    color: "#64748B",
    fontWeight: "700",
  },

  value: {
    marginTop: 6,
    fontSize: 17,
    color: "#111827",
  },

  editButton: {
    marginTop: 40,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  deleteButton: {
    marginTop: 16,
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
