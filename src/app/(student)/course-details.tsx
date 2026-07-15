import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { getCourse, Course } from "@/api/courses";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [course, setCourse] =
    useState<Course | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadCourse();
  }, []);

  async function loadCourse() {
    try {
      const data = await getCourse(id as string);
      setCourse(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <Text>Course not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {course.course_name}
      </Text>

      <Text style={styles.code}>
        {course.course_code}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Description
        </Text>

        <Text style={styles.value}>
          {course.description}
        </Text>

        <Text style={styles.label}>
          Semester
        </Text>

        <Text style={styles.value}>
          {course.semester}
        </Text>

        <Text style={styles.label}>
          Section
        </Text>

        <Text style={styles.value}>
          {course.section}
        </Text>
      </View>
    </View>
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
    marginTop: 20,
  },

  code: {
    color: "#2563EB",
    marginTop: 8,
    marginBottom: 20,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    elevation: 3,
  },

  label: {
    marginTop: 16,
    fontWeight: "700",
    color: "#374151",
  },

  value: {
    marginTop: 6,
    color: "#6B7280",
    lineHeight: 22,
  },
});