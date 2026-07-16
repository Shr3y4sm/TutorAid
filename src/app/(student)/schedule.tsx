import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "@/theme/colors";
import {
  getStudentSchedule,
  StudentSchedule,
} from "@/api/student";
import { getCurrentStudentId } from "@/services/studentService";

export default function StudentScheduleScreen() {
  const [schedule, setSchedule] =
    useState<StudentSchedule[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSchedule();
  }, []);

  async function loadSchedule() {
    try {
      const studentId =
        await getCurrentStudentId();

      const data =
        await getStudentSchedule(studentId);

      setSchedule(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
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
        My Schedule
      </Text>

      <FlatList
        data={schedule}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No scheduled classes.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subject}>
              {item.subject}
            </Text>

            <Text>
              {item.day}
            </Text>

            <Text>
              {item.start_time} - {item.end_time}
            </Text>

            <Text>
              {item.room}
            </Text>

            <Text>
              Section: {item.section}
            </Text>

            <Text>
              Teacher:{" "}
              {item.teachers?.full_name ??
                "-"}
            </Text>
          </View>
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
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 20,
  },

  empty: {
    marginTop: 40,
    textAlign: "center",
    color: "#64748B",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },

  subject: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: Colors.primary,
  },
});