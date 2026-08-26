import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import Colors from "@/theme/colors";
import { TeacherSchedule } from "../types/schedule";
import { startMeeting } from "@/api/meetings";
import {
  updateSchedule,
} from "@/api/teacherSchedule";
import {
  getCurrentTeacherId,
} from "@/services/teacherService";

interface Props {
  schedule: TeacherSchedule;
}

export default function ScheduleCard({
  schedule,
}: Props) {
  /** Starts a live video class for this scheduled slot.
   *  The meeting is linked to the schedule row so students
   *  can join it straight from their class list. */
  async function startClass() {
    try {
      const teacherId =
        await getCurrentTeacherId();

      const meeting = await startMeeting({
        teacher_id: teacherId,
        subject: schedule.subject,
        schedule_id: String(schedule.id),
      });

      // Store the meet code on the slot (best effort).
      try {
        await updateSchedule(
          String(schedule.id),
          {
            subject: schedule.subject,
            section: schedule.section,
            room: schedule.room,
            day: schedule.day,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            call_id: meeting.meet_code,
          }
        );
      } catch (linkErr) {
        console.warn(
          "Could not link meeting to schedule:",
          linkErr
        );
      }

      router.push({
        pathname: "/(video)/call",
        params: {
          classname: meeting.meet_code,
          username: "Teacher",
          role: "teacher",
          entityId: teacherId,
        },
      });
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Could not start the class."
      );
    }
  }

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

        <TouchableOpacity
          style={styles.startButton}
          onPress={startClass}
        >
          <Ionicons
            name="videocam"
            size={16}
            color="#FFF"
          />
          <Text style={styles.startButtonText}>
            Start Class
          </Text>
        </TouchableOpacity>
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

  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});