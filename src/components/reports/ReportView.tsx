import React from "react";
import { StyleSheet, Text, View } from "react-native";

import BarChart from "@/components/charts/BarChart";
import ProgressRing from "@/components/charts/ProgressRing";
import TrendLine from "@/components/charts/TrendLine";
import { StudentReport } from "@/api/reports";

interface Props {
  report: StudentReport;
  /** Optional student name shown on the teacher's view. */
  studentName?: string;
}

function shortTitle(title: string): string {
  return title.length > 12 ? `${title.slice(0, 11)}…` : title;
}

function monthLabel(ym: string): string {
  const [y, m] = ym.split("-");
  const names = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const idx = parseInt(m, 10) - 1;
  return names[idx] ? `${names[idx]} ${y.slice(2)}` : ym;
}

/**
 * Shared performance-report body: header stats, score trend,
 * per-assignment bars and monthly attendance bars.
 * Used by both the student's Reports screen and the teacher's
 * per-student report screen.
 */
export default function ReportView({ report, studentName }: Props) {
  const trend = report.assignment_scores.map((s) => ({
    label: shortTitle(s.title),
    value: s.pct,
  }));

  const bars = report.assignment_scores.map((s) => ({
    label: shortTitle(s.title),
    value: s.pct,
    sublabel: `${s.marks}/${s.max_marks}`,
  }));

  const attBars = report.attendance_by_month.map((m) => ({
    label: monthLabel(m.month),
    value: m.pct,
    sublabel: `${m.present}/${m.total}`,
  }));

  return (
    <View>
      {studentName ? (
        <Text style={styles.studentName}>{studentName}</Text>
      ) : null}

      {/* ---- Header stats ---- */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.flex1]}>
          <Text style={styles.statValue}>
            {report.overall_avg_pct == null
              ? "—"
              : `${report.overall_avg_pct}%`}
          </Text>
          <Text style={styles.statLabel}>
            Avg Score ({report.graded_count})
          </Text>
        </View>
        <ProgressRing
          pct={report.attendance_pct}
          size={96}
          caption={`Attendance (${report.attendance_total})`}
        />
      </View>

      {/* ---- Score trend ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Score Trend</Text>
        <TrendLine data={trend} />
      </View>

      {/* ---- Per-assignment bars ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Assignment Scores</Text>
        <BarChart data={bars} color="#2563EB" />
      </View>

      {/* ---- Monthly attendance ---- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Attendance</Text>
        <BarChart
          data={attBars}
          color="#10B981"
          height={140}
          emptyText="No attendance recorded yet"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  studentName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  statCard: {
    backgroundColor: "#EFF6FF",
    borderColor: "#DBEAFE",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F7",
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
});
