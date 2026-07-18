import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import { getCurrentStudentId } from "@/services/studentService";
import { getStudentAssignments } from "@/api/studentAssignments";

export default function StudentAssignmentsScreen() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      const studentId = await getCurrentStudentId();
      const data = await getStudentAssignments(studentId);
      setAssignments(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (assignments.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>
          No assignments yet.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={assignments}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => {
        const assignment = item.assignment;

        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname:
                  "/(student)/assignments/details",
                params: {
                  id: assignment.id,
                },
              })
            }
          >
            <Text style={styles.title}>
              {assignment.title}
            </Text>

            <Text style={styles.subject}>
              {assignment.subject}
            </Text>

            <Text>
              Due: {assignment.due_date}
            </Text>

            <Text>
              Marks: {assignment.max_marks}
            </Text>

            <Text>
              Status: {item.status}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    fontSize: 18,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subject: {
    color: "#2563EB",
    marginVertical: 4,
  },
});