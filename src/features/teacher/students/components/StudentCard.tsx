import { View, Text, StyleSheet } from "react-native";

import Colors from "@/theme/colors";
import Spacing from "@/theme/spacing";
import Typography from "@/theme/typography";

import { TeacherStudent } from "../types/student";
import {
  TouchableOpacity,
} from "react-native";
interface Props {
  student: TeacherStudent;

  onView?: () => void;

  onEdit?: () => void;

  onDelete?: () => void;
}

export default function StudentCard({
  student,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>
        {student.full_name}
      </Text>

      <Text style={styles.info}>
        Class: {student.class ?? "-"}
      </Text>

      <Text style={styles.info}>
        Roll No: {student.roll_no ?? "-"}
      </Text>

      <Text style={styles.info}>
        Email: {student.email ?? "-"}
      </Text>

      <Text style={styles.info}>
        Phone: {student.phone ?? "-"}
      </Text>

      <Text style={styles.info}>
        Parent: {student.parent_name ?? "-"}
      </Text>

      <Text style={styles.info}>
        Parent Phone: {student.parent_phone ?? "-"}
      </Text>
      <View
  style={{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  }}
>
  <TouchableOpacity onPress={onView}>
    <Text style={{ color: "#2563EB" }}>
      View
    </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={onEdit}>
    <Text style={{ color: "#F59E0B" }}>
      Edit
    </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={onDelete}>
    <Text style={{ color: "#DC2626" }}>
      Delete
    </Text>
  </TouchableOpacity>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  name: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 10,
  },

  info: {
    marginTop: 4,
    color: Colors.textSecondary,
  },
});