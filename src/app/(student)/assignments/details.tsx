import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  Assignment,
  StudentAssignment,
}
from "@/types/assignment";
import { router, useLocalSearchParams } from "expo-router";
import {
  getStudentAssignment,
  getStudentAssignments,
} from "@/api/studentAssignments";
import { getCurrentStudentId } from "@/services/studentService";

export default function AssignmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
 const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [studentAssignment, setStudentAssignment] =
    useState<StudentAssignment | null>(null);
  useEffect(() => {
    loadAssignment();
  }, []);

  async function loadAssignment() {
    try {
      const data = await getStudentAssignment(id);
      setAssignment(data);

      const studentId = await getCurrentStudentId();
      const studentAssignments =
        await getStudentAssignments(studentId);
      const found = studentAssignments.find(
        (sa) => sa.assignment.id === id
      );
      if (found) {
        setStudentAssignment(found);
      }
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

      {studentAssignment?.status === "Graded" ? (
        <View style={styles.gradeBox}>
          <Text style={styles.gradeTitle}>
            Assignment Graded
          </Text>

          <Text style={styles.gradeMarks}>
            Marks: {" "}
            {studentAssignment.marks ?? 0}/
            {assignment.max_marks}
          </Text>

          {studentAssignment.feedback ? (
            <Text style={styles.gradeFeedback}>
              Feedback:{" "}
              {studentAssignment.feedback}
            </Text>
          ) : null}
        </View>
      ) : studentAssignment?.status === "Submitted" ? (
        <View style={styles.submittedBox}>
          <Text style={styles.submittedText}>
            Submitted
          </Text>
          <Text style={styles.pendingText}>
            Waiting for teacher review
          </Text>
        </View>
      ) : (
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
          <Text style={styles.buttonText}>
            Submit Assignment
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  gradeBox: {
    backgroundColor: "#ECFDF5",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },

  gradeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#065F46",
    marginBottom: 8,
  },

  gradeMarks: {
    fontSize: 16,
    fontWeight: "600",
    color: "#065F46",
    marginBottom: 4,
  },

  gradeFeedback: {
    fontSize: 15,
    color: "#065F46",
    marginTop: 4,
  },

  submittedBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FCD34D",
    alignItems: "center",
  },

  submittedText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },

  pendingText: {
    fontSize: 14,
    color: "#92400E",
  },

  container: {
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