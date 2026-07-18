import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { getStudentAssignment } from "@/api/studentAssignments";

export default function AssignmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);

  useEffect(() => {
    loadAssignment();
  }, []);

  async function loadAssignment() {
    try {
      const data = await getStudentAssignment(id);
      setAssignment(data);
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

  if (!assignment) {
    return (
      <View style={styles.center}>
        <Text>Assignment not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {assignment.title}
      </Text>

      <Text style={styles.subject}>
        {assignment.subject}
      </Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Description</Text>
        <Text>{assignment.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Due Date</Text>
        <Text>{assignment.due_date}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.heading}>Maximum Marks</Text>
        <Text>{assignment.max_marks}</Text>
      </View>

      {assignment.file_url ? (
        <View style={styles.card}>
          <Text style={styles.heading}>
            Attachment Available
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
  style={styles.button}
  onPress={() =>
    router.push({
      pathname:
        "/(student)/assignments/submit",
      params: { id },
    })
  }
>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  subject: {
    color: "#2563EB",
    fontWeight: "600",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  heading: {
    fontWeight: "700",
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});