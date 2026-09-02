import { api } from "./client";

export interface ReportAssignmentScore {
  assignment_id: string;
  title: string;
  marks: number;
  max_marks: number;
  pct: number;
  graded_at: string | null;
}

export interface ReportAttendanceMonth {
  month: string;
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

export async function getStudentReport(
  studentId: string
): Promise<StudentReport> {
  const response = await api<{
    success: boolean;
    data: StudentReport;
  }>(`/reports/student/${studentId}`);
  return response.data;
}

export interface PeriodSummary {
  student_id: string;
  range: "week" | "month";
  period_start: string;
  classes_held: number;
  present_count: number;
  absent_count: number;
  attendance_pct: number | null;
  cancelled_classes: number;
}

export async function getStudentPeriodSummary(
  studentId: string,
  range: "week" | "month" = "week"
): Promise<PeriodSummary> {
  const response = await api<{ success: boolean; data: PeriodSummary }>(
    `/reports/student/${studentId}/summary?range=${range}`
  );
  return response.data;
}
