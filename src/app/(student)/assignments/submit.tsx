import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

import { getCurrentStudentId } from "@/services/studentService";
import { getStudentAssignment } from "@/api/studentAssignments";
import { submitAssignment } from "@/api/studentAssignments";
import { uploadStudentFile } from "@/services/storageService";
import { Assignment } from "@/types/assignment";

export default function SubmitAssignmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [studentId, setStudentId] =
    useState("");

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [content, setContent] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const sid = await getCurrentStudentId();
      setStudentId(sid);

      const data = await getStudentAssignment(id);
      setAssignment(data);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message ?? "Unable to load assignment."
      );
    } finally {
      setLoading(false);
    }
  }

  async function pickFile() {
    try {
      const result =
        await DocumentPicker.getDocumentAsync({
          multiple: false,
          copyToCacheDirectory: true,
          type: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/*",
          ],
        });

      if (result.canceled) return;
      setSelectedFile(result.assets[0]);
    } catch (err) {
      Alert.alert(
        "Error",
        "Unable to pick file."
      );
    }
  }

  async function handleSubmit() {
    if (!content.trim()) {
      Alert.alert(
        "Enter your answer",
        "Please write something before submitting."
      );
      return;
    }

    if (!studentId) {
      Alert.alert("Error", "Student ID not found.");
      return;
    }

    setSubmitting(true);

    try {
      let fileUrl = "";

      if (selectedFile) {
        fileUrl = await uploadStudentFile({
          uri: selectedFile.uri,
          name: selectedFile.name,
          mimeType:
            selectedFile.mimeType,
        });
      }

      await submitAssignment(id, {
        student_id: studentId,
        file_url: fileUrl,
        content,
      });

      Alert.alert(
        "Success",
        "Assignment submitted successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Error",
        err?.message ?? "Unable to submit assignment."
      );
    } finally {
      setSubmitting(false);
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

  if (!assignment) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>
          Assignment not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Submit Assignment
      </Text>

      <Text style={styles.assignmentTitle}>
        {assignment.title}
      </Text>

      <Text style={styles.subject}>
        {assignment.subject}
      </Text>

      <Text style={styles.dueDate}>
        Due: {assignment.due_date}
      </Text>

      <Text style={styles.label}>
        Your Answer
      </Text>

      <TextInput
        placeholder="Type your answer here..."
        value={content}
        onChangeText={setContent}
        multiline
        style={styles.textInput}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={styles.fileButton}
        onPress={pickFile}
      >
        <Text style={styles.fileButtonText}>
          {selectedFile
            ? `📎 ${selectedFile.name}`
            : "📄 Attach File"}
        </Text>
      </TouchableOpacity>

      {selectedFile ? (
        <Text style={styles.note}>
          File will be uploaded with
          your submission.
        </Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.submitButton,
          submitting &&
            styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting
            ? "Submitting..."
            : "Submit Assignment"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    marginBottom: 20,
    color: "#111827",
  },

  assignmentTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111827",
  },

  subject: {
    color: "#2563EB",
    fontWeight: "600",
    marginBottom: 4,
  },

  dueDate: {
    color: "#EF4444",
    fontSize: 13,
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#374151",
  },

  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    minHeight: 200,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    fontSize: 15,
  },

  fileButton: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563EB",
  },

  fileButtonText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 15,
  },

  note: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 16,
  },

  submitButton: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
