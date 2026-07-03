import {
  Text,
  View,
  StyleSheet,
} from "react-native";

type Props = {
  label: string;
  value: string | number;
};

export default function ProfileStatCard({
  label,
  value,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  value: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563EB",
  },

  label: {
    marginTop: 8,
    color: "#64748B",
    fontWeight: "600",
  },
});
