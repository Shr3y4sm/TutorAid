import { ScrollView, StyleSheet } from "react-native";

import CourseCard from "@/features/courses/components/CourseCard";
import { courses } from "@/features/courses/data/courses";

export default function CoursesScreen() {
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
});