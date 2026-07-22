import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import { getAssignments } from "@/api/assignments";
import { TeacherAssignment } from "@/features/teacher/assignments/types/assignment";
import AssignmentCard from "@/features/assignments/components/AssignmentCard";
import { getCurrentStudentId } from "@/services/studentService";
export default function AssignmentsScreen() {
  const [assignments, setAssignments] =
  useState<TeacherAssignment[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
  try {
    setError(null);

    const studentId =
      await getCurrentStudentId();

    const data =
      await getAssignments(studentId);

    setAssignments(data);
  } catch (loadError) {
    console.log(loadError);

    setError(
      "Unable to load assignments."
    );
  } finally {
    setLoading(false);
  }
}

  async function refreshAssignments() {
    setRefreshing(true);

    try {
      await loadAssignments();
    } finally {
      setRefreshing(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>
          Assignments
        </Text>

        <Text style={styles.message}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadAssignments}
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refreshAssignments}
        />
      }
    >
      <Text style={styles.title}>
        Assignments
      </Text>

      {assignments.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.message}>
            No assignments yet.
          </Text>
        </View>
      ) : (
        assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
          />
        ))
      )}
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },

  message: {
    color: "#64748B",
    fontSize: 16,
    textAlign: "center",
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 2,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
});
