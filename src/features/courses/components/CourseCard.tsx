import { router } from "expo-router";
import {
  View,
  Text,
 TouchableOpacity,
  StyleSheet,
} from "react-native";

type Props = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  students: number;
  color: string;
};

export default function CourseCard({
  id,
  title,
  instructor,
  progress,
  students,
  color,
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
      <View
        style={[
          styles.colorBar,
          { backgroundColor: color },
        ]}
      />

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.teacher}>
        {instructor}
      </Text>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text>{progress}% Complete</Text>

        <Text>{students} Students</Text>
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

  colorBar: {
    width: 50,
    height: 6,
    borderRadius: 4,
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  teacher: {
    color: "#64748B",
    marginTop: 6,
    marginBottom: 18,
  },

  progressBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    borderRadius: 4,
  },

  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});