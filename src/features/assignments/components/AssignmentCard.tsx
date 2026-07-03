import { router } from "expo-router";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

import { Assignment } from "@/api/assignments";
import StatusBadge from "@/components/StatusBadge";

type Props = {
  assignment: Assignment;
};

export default function AssignmentCard({
  assignment,
}: Props) {
  function openCourse() {
    router.push({
      pathname: "/(student)/course-details",
      params: {
        id: assignment.course,
      },
    });
  }

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={openCourse}
    >
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>
            {assignment.title}
          </Text>

          <Text style={styles.course}>
            {assignment.course}
          </Text>
        </View>

        <StatusBadge
          status={assignment.status}
        />
      </View>

      <Text
        style={styles.description}
        numberOfLines={2}
      >
        {assignment.description}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.meta}>
          Due {assignment.dueDate}
        </Text>

        <Text style={styles.meta}>
          {assignment.obtainedMarks === null
            ? `${assignment.maxMarks} marks`
            : `${assignment.obtainedMarks}/${assignment.maxMarks} marks`}
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  titleGroup: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  course: {
    color: "#64748B",
    marginTop: 6,
  },

  description: {
    marginTop: 14,
    color: "#475569",
    lineHeight: 20,
  },

  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  meta: {
    color: "#64748B",
    fontWeight: "600",
  },
});
