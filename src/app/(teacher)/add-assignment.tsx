import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";

import { getCurrentTeacherId } from "@/services/teacherService";
import { getTeacherStudents } from "@/api/teacherStudents";
import { createAssignment } from "@/api/teacherAssignments";

import { TeacherStudent } from "@/features/teacher/students/types/student";

export default function AddAssignmentScreen() {
  const [teacherId, setTeacherId] = useState("");

  const [students, setStudents] = useState<TeacherStudent[]>([]);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [title, setTitle] = useState("");

  const [subject, setSubject] = useState("");

  const [description, setDescription] = useState("");

  const [dueDate, setDueDate] = useState("");

  const [maxMarks, setMaxMarks] = useState("100");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const id = await getCurrentTeacherId();

      setTeacherId(id);

      const data = await getTeacherStudents(id);

      setStudents(data);
    } catch (err) {
      console.log(err);
      Alert.alert("Unable to load students.");
    }
  }

  function toggleStudent(studentId: string) {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(
        selectedStudents.filter((id) => id !== studentId)
      );
    } else {
      setSelectedStudents([
        ...selectedStudents,
        studentId,
      ]);
    }
  }

  async function saveAssignment() {
    if (!title.trim()) {
      Alert.alert("Enter assignment title.");
      return;
    }

    if (!subject.trim()) {
      Alert.alert("Enter subject.");
      return;
    }

    if (selectedStudents.length === 0) {
      Alert.alert("Select at least one student.");
      return;
    }

    try {
      await createAssignment({
        teacher_id: teacherId,
        title,
        description,
        subject,
        due_date: dueDate,
        max_marks: Number(maxMarks),
        students: selectedStudents,
      });

      Alert.alert(
        "Success",
        "Assignment created successfully."
      );

      router.back();
    } catch (err) {
      console.log(err);

      Alert.alert(
        "Error",
        "Failed to create assignment."
      );
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        New Assignment
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, { height: 120 }]}
      />

      <TextInput
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
      />

      <TextInput
        placeholder="Max Marks"
        keyboardType="numeric"
        value={maxMarks}
        onChangeText={setMaxMarks}
        style={styles.input}
      />

      <Text style={styles.heading}>
        Select Students
      </Text>

      <FlatList
        data={students}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.studentCard,
              selectedStudents.includes(item.id)
                ? styles.selectedCard
                : null,
            ]}
            onPress={() =>
              toggleStudent(item.id)
            }
          >
            <View>
              <Text style={styles.studentName}>
                {item.full_name}
              </Text>

              <Text style={styles.studentClass}>
                Class {item.class ?? "-"}
              </Text>
            </View>

            <Text style={styles.selectText}>
              {selectedStudents.includes(item.id)
                ? "✅"
                : "⬜"}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveAssignment}
      >
        <Text style={styles.buttonText}>
          Publish Assignment
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 10,
    color: "#111827",
  },

  studentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  selectedCard: {
    borderColor: "#2563EB",
    borderWidth: 2,
  },

  studentName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
  },

  studentClass: {
    marginTop: 4,
    color: "#6B7280",
  },

  selectText: {
    fontSize: 22,
  },

  button: {
    marginTop: 24,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});