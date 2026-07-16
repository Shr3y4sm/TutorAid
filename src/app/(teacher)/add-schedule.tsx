import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import Colors from "@/theme/colors";
import { getCurrentTeacherId } from "@/services/teacherService";
import { createSchedule } from "@/api/teacherSchedule";

export default function AddScheduleScreen() {
  const [subject, setSubject] = useState("");
  const [section, setSection] = useState("");
  const [room, setRoom] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  async function save() {
    try {
      const teacherId = await getCurrentTeacherId();

      await createSchedule({
        teacher_id: teacherId,
        subject,
        section,
        room,
        day,
        start_time: startTime,
        end_time: endTime,
      });

      Alert.alert(
        "Success",
        "Schedule created successfully."
      );

      router.back();

    } catch (err) {
      console.log(err);

      Alert.alert(
        "Error",
        "Unable to create schedule."
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Add Schedule
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={styles.input}
        placeholder="Section"
        value={section}
        onChangeText={setSection}
      />

      <TextInput
        style={styles.input}
        placeholder="Room"
        value={room}
        onChangeText={setRoom}
      />

      <TextInput
        style={styles.input}
        placeholder="Day"
        value={day}
        onChangeText={setDay}
      />

      <TextInput
        style={styles.input}
        placeholder="Start Time (09:00)"
        value={startTime}
        onChangeText={setStartTime}
      />

      <TextInput
        style={styles.input}
        placeholder="End Time (10:00)"
        value={endTime}
        onChangeText={setEndTime}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={save}
      >
        <Text style={styles.buttonText}>
          Save Schedule
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});