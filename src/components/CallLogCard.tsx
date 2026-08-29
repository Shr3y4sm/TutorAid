import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import StatusBadge from "@/components/StatusBadge";

import type { MeetingSession } from "@/api/meetings";

type Props = {
  meeting: MeetingSession;
  /** e.g. "Present" | "Absent" | "" — shown in a badge on the right. */
  presenceLabel?: string;
  rightMeta?: string;
  onPress?: () => void;
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CallLogCard({
  meeting,
  presenceLabel,
  rightMeta,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.92}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="videocam" size={18} color="#2563EB" />
      </View>

      <View style={styles.body}>
        <Text style={styles.subject} numberOfLines={1}>
          {meeting.subject || "Class"}
        </Text>

        <Text style={styles.meta}>
          {formatDate(meeting.started_at)}
          {meeting.ended_at ? ` · ${formatDate(meeting.ended_at)}` : ""}
        </Text>

        <Text style={styles.code}>
          {meeting.meet_code}
        </Text>

        {typeof rightMeta === "string" && rightMeta.length > 0 ? (
          <Text style={styles.meta}>{rightMeta}</Text>
        ) : null}
      </View>

      {renderBadge()}
    </TouchableOpacity>
  );

  function renderBadge() {
    if (presenceLabel === "Present") {
      return <StatusBadge status="Submitted" />;
    }
    if (presenceLabel === "Absent") {
      return <StatusBadge status="Overdue" />;
    }
    if (presenceLabel === "Live") {
      return (
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>Live</Text>
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#0F172A",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  body: {
    flex: 1,
  },

  subject: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  meta: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },

  code: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: 0.5,
  },

  liveBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  liveBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#166534",
  },
});