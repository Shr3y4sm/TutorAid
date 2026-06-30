import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Course Details
      </Text>

      <Text style={styles.subtitle}>
        Course ID: {id}
      </Text>

      <View style={styles.card}>
        <Text style={styles.item}>
          📢 Announcements
        </Text>

        <Text style={styles.item}>
          📝 Assignments
        </Text>

        <Text style={styles.item}>
          📂 Materials
        </Text>

        <Text style={styles.item}>
          📅 Attendance
        </Text>

        <Text style={styles.item}>
          🎥 Live Class
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

  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 8,
    color: "#64748B",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },

  item: {
    fontSize: 18,
    marginBottom: 20,
  },
});