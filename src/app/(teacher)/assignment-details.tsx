import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  useLocalSearchParams,
  router,
} from "expo-router";

import Colors from "@/theme/colors";

import {
  deleteAssignment,
} from "@/api/teacherAssignments";

export default function AssignmentDetailsScreen() {
  const assignment = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {String(assignment.title)}
      </Text>

      <Text style={styles.label}>
        Subject
      </Text>

      <Text style={styles.value}>
        {String(assignment.subject)}
      </Text>

      <Text style={styles.label}>
        Description
      </Text>

      <Text style={styles.value}>
        {String(assignment.description)}
      </Text>

      <Text style={styles.label}>
        Due Date
      </Text>

      <Text style={styles.value}>
        {String(assignment.due_date)}
      </Text>

      <Text style={styles.label}>
        Max Marks
      </Text>

      <Text style={styles.value}>
        {String(assignment.max_marks)}
      </Text>

      {/* Edit */}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname:
              "/(teacher)/edit-assignment",
            params: {
              id: String(assignment.id),
              title: String(
                assignment.title
              ),
              description: String(
                assignment.description
              ),
              subject: String(
                assignment.subject
              ),
              due_date: String(
                assignment.due_date
              ),
              max_marks: String(
                assignment.max_marks
              ),
            },
          })
        }
      >
        <Text style={styles.buttonText}>
          Edit Assignment
        </Text>
      </TouchableOpacity>

      {/* Delete */}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            "Delete Assignment",
            "Are you sure you want to delete this assignment?",
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
                    await deleteAssignment(
                      String(
                        assignment.id
                      )
                    );

                    Alert.alert(
                      "Deleted",
                      "Assignment deleted successfully."
                    );

                    router.replace(
                      "/(teacher)/assignments"
                    );
                  } catch {
                    Alert.alert(
                      "Error",
                      "Unable to delete assignment."
                    );
                  }
                },
              },
            ]
          )
        }
      >
        <Text style={styles.buttonText}>
          Delete Assignment
        </Text>
      </TouchableOpacity>

      {/* Student Submissions */}

      <TouchableOpacity
        style={styles.studentsButton}
        onPress={() =>
          router.push({
            pathname:
              "/(teacher)/assignment-submissions",
            params: {
              assignmentId: String(
                assignment.id
              ),
              title: String(
                assignment.title
              ),
            },
          })
        }
      >
        <Text style={styles.buttonText}>
          View Student Submissions
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },

  label: {
    marginTop: 18,
    fontWeight: "700",
    color: "#64748B",
  },

  value: {
    marginTop: 4,
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
    marginTop: 14,
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  studentsButton: {
    marginTop: 14,
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});