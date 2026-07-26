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
import { router, useLocalSearchParams } from "expo-router";

import Colors from "@/theme/colors";
import { updateSchedule } from "@/api/teacherSchedule";

export default function EditScheduleScreen() {
  const params = useLocalSearchParams();

  const [subject, setSubject] = useState(
    String(params.subject ?? "")
  );
  const [section, setSection] = useState(
    String(params.section ?? "")
  );
  const [room, setRoom] = useState(
    String(params.room ?? "")
  );
  const [day, setDay] = useState(
    String(params.day ?? "")
  );
  const [startTime, setStartTime] = useState(
    String(params.start_time ?? "")
  );
  const [endTime, setEndTime] = useState(
    String(params.end_time ?? "")
  );

  async function save() {
    try {
      await updateSchedule(String(params.id), {
        subject,
        section,
        room,
        day,
        start_time: startTime,
        end_time: endTime,
      });

      Alert.alert(
        "Success",
        "Schedule updated successfully."
      );

      router.back();

    } catch (err) {
      console.log(err);

      Alert.alert(
        "Error",
        "Unable to update schedule."
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Edit Schedule
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
          Save Changes
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
