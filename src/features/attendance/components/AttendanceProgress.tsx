import { View, StyleSheet } from "react-native";

interface Props {
  percentage: number;
}

export default function AttendanceProgress({
  percentage,
}: Props) {
  return (
    <View style={styles.track}>
      <View
        style={[
          styles.fill,
          {
            width: `${percentage}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    backgroundColor: "#E2E8F0",
    borderRadius: 20,
    overflow: "hidden",
  },

  fill: {
    height: 10,
    backgroundColor: "#2563EB",
    borderRadius: 20,
  },
});