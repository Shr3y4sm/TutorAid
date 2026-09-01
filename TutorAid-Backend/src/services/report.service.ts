import supabase from "../config/supabase";
import { ApiError } from "../utils/ApiError";

export interface ReportAssignmentScore {
  assignment_id: string;
  title: string;
  marks: number;
  max_marks: number;
  pct: number;
  graded_at: string | null;
}

export interface ReportAttendanceMonth {
  month: string; // YYYY-MM
  total: number;
  present: number;
  pct: number;
}

export interface StudentReport {
  student_id: string;
  overall_avg_pct: number | null;
  graded_count: number;
  attendance_pct: number | null;
  attendance_total: number;
  assignment_scores: ReportAssignmentScore[];
  attendance_by_month: ReportAttendanceMonth[];
}

/**
 * Performance report for a single student:
 *  - graded assignment scores (with % against max_marks)
 *  - attendance aggregated per month (canonical boolean schema)
 */
export class ReportService {
  static async getStudentReport(
    studentId: string
  ): Promise<StudentReport> {
    // ---- Graded assignments ----
    const { data: submissions, error: subError } = await supabase
      .from("assignment_submissions")
      .select(
        `
        assignment_id,
        marks,
        status,
        submitted_at,
        assignments (
          title,
          max_marks
        )
      `
      )
      .eq("student_id", studentId)
      .eq("status", "Graded")
      .not("marks", "is", null)
      .order("submitted_at", { ascending: true });

    if (subError) throw new ApiError(400, subError.message);

    const assignmentScores: ReportAssignmentScore[] = (
      submissions ?? []
    ).map((row: any) => {
      const max = row.assignments?.max_marks ?? 0;
      return {
        assignment_id: row.assignment_id,
        title: row.assignments?.title ?? "Assignment",
        marks: row.marks,
        max_marks: max,
        pct: max > 0 ? Math.round((row.marks / max) * 100) : 0,
        graded_at: row.submitted_at ?? null,
      };
    });

    const overallAvgPct =
      assignmentScores.length > 0
        ? Math.round(
            assignmentScores.reduce(
              (sum, s) => sum + s.pct,
              0
            ) / assignmentScores.length
          )
        : null;

    // ---- Attendance (last 180 days) ----
    const since = new Date();
    since.setDate(since.getDate() - 180);
    const sinceStr = since.toISOString().slice(0, 10);

    const { data: attendance, error: attError } = await supabase
      .from("attendance")
      .select("class_date, present")
      .eq("student_id", studentId)
      .gte("class_date", sinceStr)
      .order("class_date", { ascending: true });

    if (attError) throw new ApiError(400, attError.message);

    const monthMap = new Map<
      string,
      { total: number; present: number }
    >();
    for (const row of attendance ?? []) {
      const month = (row.class_date ?? "").slice(0, 7);
      if (!month) continue;
      const bucket = monthMap.get(month) ?? {
        total: 0,
        present: 0,
      };
      bucket.total += 1;
      if (row.present) bucket.present += 1;
      monthMap.set(month, bucket);
    }

    const attendance_by_month: ReportAttendanceMonth[] = Array.from(
      monthMap.entries()
    ).map(([month, b]) => ({
      month,
      total: b.total,
      present: b.present,
      pct: b.total > 0 ? Math.round((b.present / b.total) * 100) : 0,
    }));

    const attendance_total = attendance?.length ?? 0;
    const attendance_present = (attendance ?? []).filter(
      (r: any) => r.present
    ).length;
    const attendance_pct =
      attendance_total > 0
        ? Math.round((attendance_present / attendance_total) * 100)
        : null;

    return {
      student_id: studentId,
      overall_avg_pct: overallAvgPct,
      graded_count: assignmentScores.length,
      attendance_pct,
      attendance_total,
      assignment_scores: assignmentScores,
      attendance_by_month,
    };
  }
}
