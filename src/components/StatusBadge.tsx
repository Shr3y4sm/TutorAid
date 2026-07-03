import { Text, View, StyleSheet } from "react-native";

export type StatusBadgeStatus =
  | "Pending"
  | "Submitted"
  | "Overdue";

type Props = {
  status: StatusBadgeStatus;
};

const statusColors: Record<
  StatusBadgeStatus,
  {
    background: string;
    text: string;
  }
> = {
  Pending: {
    background: "#FEF3C7",
    text: "#92400E",
  },
  Submitted: {
    background: "#D1FAE5",
    text: "#047857",
  },
  Overdue: {
    background: "#FEE2E2",
    text: "#B91C1C",
  },
};

export default function StatusBadge({
  status,
}: Props) {
  const colors = statusColors[status];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color: colors.text,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
