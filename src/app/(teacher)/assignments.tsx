import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
} from "react-native";

import Colors from "@/theme/colors";

import { getTeacherAssignments } from "@/api/teacherAssignments";
import { getCurrentTeacherId } from "@/services/teacherService";
import AssignmentCard from "@/features/teacher/assignments/components/AssignmentCard";

import {
  TeacherAssignment,
} from "@/features/teacher/assignments/types/assignment";
import { router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
export default function TeacherAssignmentsScreen() {
  const [assignments, setAssignments] =
    useState<TeacherAssignment[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
  try {
    const teacherId = await getCurrentTeacherId();

    const data = await getTeacherAssignments(teacherId);

    setAssignments(data);
  } catch (err) {
    console.error(err);
  }
}
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
  <Text style={styles.heading}>
    Assignments
  </Text>

  <TouchableOpacity
    style={styles.addButton}
    onPress={() =>
      router.push("/(teacher)/add-assignment")
    }
  >
    <Ionicons
      name="add"
      size={22}
      color="white"
    />
  </TouchableOpacity>
</View>

      <FlatList
        data={assignments}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <AssignmentCard assignment={item} />
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
  header: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 20,
},

addButton: {
  width: 42,
  height: 42,
  borderRadius: 21,
  backgroundColor: Colors.primary,
  justifyContent: "center",
  alignItems: "center",
},
});

