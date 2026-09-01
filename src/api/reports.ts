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
