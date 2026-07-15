import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Props = {
  id: string;
  course_name: string;
  description: string;
  course_code: string;
  semester: number;
  section: string;
};

export default function CourseCard({
  id,
  course_name,
  description,
  course_code,
  semester,
  section,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/(student)/course-details",
          params: { id },
        })
      }
    >
      <Text style={styles.title}>
        {course_name}
      </Text>

      <Text style={styles.code}>
        {course_code}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          Semester {semester}
        </Text>

        <Text style={styles.meta}>
          Section {section}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  code: {
    marginTop: 6,
    color: "#2563EB",
    fontWeight: "600",
  },

  description: {
    marginTop: 12,
    color: "#64748B",
    lineHeight: 20,
  },

  footer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  meta: {
    color: "#64748B",
    fontWeight: "600",
  },
});