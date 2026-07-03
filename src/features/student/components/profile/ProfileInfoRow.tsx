import {
  Text,
  View,
  StyleSheet,
} from "react-native";

type Props = {
  label: string;
  value: string | number;
};

export default function ProfileInfoRow({
  label,
  value,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  label: {
    color: "#64748B",
    flex: 1,
  },

  value: {
    color: "#111827",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
});
