import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  getStudentPeriodSummary,
  PeriodSummary,
} from "@/api/reports";

interface Props {
  studentId: string;
}

/**
 * Weekly / monthly rollup for one student: classes held, attended,
 * missed and cancelled — with a Week | Month segmented toggle.
 * Self-contained: owns its range state and fetching.
 */
export default function PeriodSummaryCard({ studentId }: Props) {
  const [range, setRange] = useState<"week" | "month">("week");
  const [summary, setSummary] = useState<PeriodSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentPeriodSummary(studentId, range);
        if (!cancelled) setSummary(data);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Unable to load summary.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [studentId, range]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>Period Summary</Text>
        <View style={styles.segmentWrap}>
          {(["week", "month"] as const).map((r) => (
            <Text
              key={r}
              onPress={() => setRange(r)}
              style={[styles.segment, range === r && styles.segmentActive]}
            >
              {r === "week" ? "Week" : "Month"}
            </Text>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : summary ? (
        <>
          <View style={styles.tilesRow}>
            <StatTile
              label="Classes"
              value={summary.classes_held}
              color="#2563EB"
            />
            <StatTile
              label="Present"
              value={summary.present_count}
              color="#10B981"
            />
            <StatTile
              label="Missed"
              value={summary.absent_count}
              color="#F59E0B"
            />
            <StatTile
              label="Cancelled"
              value={summary.cancelled_classes}
              color="#EF4444"
            />
          </View>
          {summary.attendance_pct != null ? (
            <Text style={styles.footer}>
              {summary.attendance_pct}% attendance · since{" "}
              {new Date(summary.period_start).toLocaleDateString()}
            </Text>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

function StatTile({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.tile}>
      <Text style={[styles.tileValue, { color }]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  segmentWrap: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 2,
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    borderRadius: 8,
    overflow: "hidden",
  },
  segmentActive: {
    backgroundColor: "#FFFFFF",
    color: "#2563EB",
  },
  center: {
    paddingVertical: 18,
    alignItems: "center",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    paddingVertical: 10,
  },
  tilesRow: {
    flexDirection: "row",
    gap: 8,
  },
  tile: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    paddingVertical: 12,
    alignItems: "center",
  },
  tileValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  tileLabel: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  footer: {
    marginTop: 10,
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
});
