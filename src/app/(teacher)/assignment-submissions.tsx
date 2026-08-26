import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  getAssignmentSubmissions,
  TeacherSubmission,
} from "@/api/teacherAssignments";
import { gradeSubmission } from "@/api/grading";
import Colors from "@/theme/colors";
import FileAttachment from "@/components/FileAttachment";

export default function AssignmentSubmissionsScreen() {
  const params = useLocalSearchParams<{
    assignmentId: string;
    title: string;
  }>();

  const assignmentId = Array.isArray(params.assignmentId)
    ? params.assignmentId[0]
    : params.assignmentId;

  const [submissions, setSubmissions] =
    useState<TeacherSubmission[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [grading, setGrading] =
    useState(false);

  const [selectedSubmission, setSelectedSubmission] =
    useState<TeacherSubmission | null>(null);

  const [marks, setMarks] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function load() {
    try {
      const data =
        await getAssignmentSubmissions(
          assignmentId
        );
      setSubmissions(data);
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        "Unable to load submissions."
      );
    } finally {
      setLoading(false);
    }
  }

  function openGrading(
    submission: TeacherSubmission
  ) {
    setSelectedSubmission(submission);
    setMarks(
      submission.marks
        ? String(submission.marks)
        : ""
    );
    setFeedback(
      submission.feedback ?? ""
    );
  }

  async function saveGrade() {
    if (!selectedSubmission) return;

    const marksNum = Number(marks);

    if (isNaN(marksNum) || marksNum < 0) {
      Alert.alert(
        "Invalid Marks",
        "Please enter valid marks."
      );
      return;
    }

    setGrading(true);

    try {
      await gradeSubmission(
        selectedSubmission.id,
        marksNum,
        feedback
      );

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id
            ? {
                ...s,
                marks: marksNum,
                feedback,
                status: "Graded",
              }
            : s
        )
      );

      Alert.alert(
        "Success",
        "Submission graded successfully."
      );
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Error",
        "Unable to grade submission."
      );
    } finally {
      setGrading(false);
      setSelectedSubmission(null);
    }
  }

  function isFileUrl(url: string) {
    return (
      url.startsWith("http://") ||
      url.startsWith("https://")
    );
  }

  function getStatusColor(
    status: string
  ) {
    switch (status) {
      case "Submitted":
        return "#F59E0B";
      case "Graded":
        return "#10B981";
      default:
        return "#9CA3AF";
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.text}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          {params.title}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No submissions yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              openGrading(item)
            }
            activeOpacity={0.7}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.studentName}>
                {item.student?.full_name ??
                  "Unknown"}
              </Text>

              <Text
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      getStatusColor(item.status),
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>

            <Text style={styles.rollNo}>
              Roll:{" "}
              {item.student?.roll_no ?? "-"}
            </Text>

            {item.submitted_at ? (
              <Text style={styles.submittedAt}>
                Submitted:{" "}
                {new Date(
                  item.submitted_at
                ).toLocaleString()}
              </Text>
            ) : null}

            {/* Typed answer (legacy rows may have it stored in file_url) */}
            {item.content ? (
              <Text
                style={styles.contentPreview}
                numberOfLines={3}
              >
                {item.content}
              </Text>
            ) : null}

            {item.file_url && !isFileUrl(item.file_url) ? (
              <Text
                style={styles.contentPreview}
                numberOfLines={3}
              >
                {item.file_url}
              </Text>
            ) : null}

            {/* Attached file */}
            {item.file_url && isFileUrl(item.file_url) ? (
              <FileAttachment
                url={item.file_url}
                label="View Submitted File"
              />
            ) : null}

            {item.marks != null && (
              <Text style={styles.marks}>
                Marks: {item.marks}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />

      {/* Grading Modal */}
      <Modal
        visible={
          !!selectedSubmission
        }
        transparent
        animationType="slide"
        onRequestClose={() =>
          setSelectedSubmission(null)
        }
      >
        <View
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Grade Submission
            </Text>

            <Text style={styles.modalStudent}>
              {selectedSubmission?.student
                ?.full_name ?? "Unknown"}
            </Text>

            {/* Typed answer */}
            {selectedSubmission?.content ||
            (selectedSubmission?.file_url &&
              !isFileUrl(selectedSubmission.file_url)) ? (
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>
                  Student Answer
                </Text>

                <Text style={styles.answerText}>
                  {selectedSubmission.content ??
                    selectedSubmission.file_url}
                </Text>
              </View>
            ) : null}

            {/* Attached file */}
            {selectedSubmission?.file_url &&
            isFileUrl(selectedSubmission.file_url) ? (
              <View style={styles.answerBox}>
                <Text style={styles.answerLabel}>
                  Submitted File
                </Text>

                <FileAttachment
                  url={selectedSubmission.file_url}
                  label="Open Submitted File"
                />
              </View>
            ) : null}

            <TextInput
              placeholder="Marks"
              value={marks}
              onChangeText={setMarks}
              keyboardType="numeric"
              style={styles.modalInput}
            />

            <TextInput
              placeholder="Feedback"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              style={[
                styles.modalInput,
                { height: 120 },
              ]}
              textAlignVertical="top"
            />

            <View
              style={styles.modalButtons}
            >
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setSelectedSubmission(null)
                }
              >
                <Text
                  style={styles.cancelButtonText}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.gradeButton}
                onPress={saveGrade}
                disabled={grading}
              >
                {grading ? (
                  <ActivityIndicator
                    color="#FFF"
                    size="small"
                  />
                ) : (
                  <Text
                    style={styles.gradeButtonText}
                  >
                    Save Grade
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    color: Colors.text,
  },

  card: {
    backgroundColor: Colors.surface ?? "#FFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:
      "center",
    marginBottom: 8,
  },

  studentName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },

  rollNo: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },

  submittedAt: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 6,
  },

  contentPreview: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },

  marks: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
    marginTop: 6,
  },

  empty: {
    marginTop: 60,
    alignItems: "center",
  },

  emptyText: {
    color: "#64748B",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },

  modalStudent: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2563EB",
    marginBottom: 16,
  },

  answerBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  answerLabel: {
    fontWeight: "700",
    marginBottom: 4,
    color: "#374151",
  },

  answerText: {
    fontSize: 14,
    color: "#374151",
  },

  modalInput: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
  },

  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cancelButtonText: {
    color: "#64748B",
    fontWeight: "700",
    fontSize: 16,
  },

  gradeButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  gradeButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
