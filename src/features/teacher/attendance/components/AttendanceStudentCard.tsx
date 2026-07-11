import { View, Text, Switch, StyleSheet } from "react-native";

import Colors from "@/theme/colors";

interface Props {
  name: string;
  rollNo: string;
  present: boolean;
  onToggle: () => void;
}

export default function AttendanceStudentCard({
  name,
  rollNo,
  present,
  onToggle,
}: Props) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text>{rollNo}</Text>
      </View>

      <Switch
        value={present}
        onValueChange={onToggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    marginBottom: 12,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontWeight: "700",
    fontSize: 16,
  },
});