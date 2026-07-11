import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";

import Colors from "@/theme/colors";

import { getTeacherAssignments } from "@/api/teacherAssignments";

import AssignmentCard from "@/features/teacher/assignments/components/AssignmentCard";

import {
  TeacherAssignment,
} from "@/features/teacher/assignments/types/assignment";

export default function TeacherAssignmentsScreen() {
  const [assignments, setAssignments] =
    useState<TeacherAssignment[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data =
      await getTeacherAssignments();

    setAssignments(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        Assignments
      </Text>

      <FlatList
        data={assignments}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <AssignmentCard {...item} />
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

  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
});