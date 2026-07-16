import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

import Colors from "@/theme/colors";
import { TeacherSchedule } from "../types/schedule";

interface Props {
  schedule: TeacherSchedule;
}

export default function ScheduleCard({
  schedule,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/(teacher)/schedule-details",
          params: {
            id: String(schedule.id),
            subject: schedule.subject,
            section: schedule.section,
            room: schedule.room,
            day: schedule.day,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
          },
        })
      }
    >
      <View style={styles.card}>
        <Text style={styles.subject}>
          {schedule.subject}
        </Text>

        <Text style={styles.info}>
          Section: {schedule.section}
        </Text>

        <Text style={styles.info}>
          Room: {schedule.room}
        </Text>

        <Text style={styles.info}>
          Day: {schedule.day}
        </Text>

        <Text style={styles.time}>
          {schedule.start_time} - {schedule.end_time}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  subject: {
    fontSize: 19,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },

  info: {
    color: Colors.textSecondary,
    marginTop: 4,
  },

  time: {
    marginTop: 10,
    fontWeight: "700",
    color: Colors.primary,
  },
});