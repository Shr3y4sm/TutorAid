import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Colors from "@/theme/colors";
import { TeacherAssignment } from "../types/assignment";
import { router } from "expo-router";
interface Props {
  assignment: TeacherAssignment;
}

export default function AssignmentCard({
  assignment,
}: Props) {
  return (
  <TouchableOpacity
  style={styles.card}
  activeOpacity={0.9}
  onPress={() =>
    router.push({
      pathname: "/(teacher)/assignment-details",
      params: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description ?? "",
        subject: assignment.subject ?? "",
        due_date: assignment.due_date,
        max_marks: String(assignment.max_marks),
      },
    })
  }
>
      <Text style={styles.title}>
        {assignment.title}
      </Text>

      <Text>
        Subject : {assignment.subject}
      </Text>

      <Text>
        Due : {assignment.due_date}
      </Text>

      <Text>
        Max Marks : {assignment.max_marks}
      </Text>

      <Text style={styles.status}>
        {assignment.status}
      </Text>

      {assignment.description ? (
        <Text style={styles.description}>
          {assignment.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  status: {
    marginTop: 10,
    fontWeight: "700",
    color: Colors.primary,
  },

  description: {
    marginTop: 8,
    color: "#666",
  },
});