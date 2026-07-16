import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from "react-native";

import CourseCard from "@/features/courses/components/CourseCard";
import {
  Course,
  getCourses,
} from "@/api/courses";
import { getCurrentStudentId } from "@/services/studentService";

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const studentId =
        await getCurrentStudentId();

      const data =
        await getCourses(studentId);

      setCourses(data ?? []);
    } catch (err) {
      console.log(err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (courses.length === 0) {
    return (
      <View style={styles.loader}>
        <Text style={styles.empty}>
          No courses enrolled yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          {...course}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    fontSize: 16,
    color: "#64748B",
  },
});