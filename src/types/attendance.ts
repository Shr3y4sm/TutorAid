/**
 * Canonical attendance record. Matches what meeting auto-marking
 * and teacher manual marking write to the `attendance` table.
 */
export interface Attendance {
  id: string;
  student_id: string;
  marked_by: string;

  /** YYYY-MM-DD */
  class_date: string;

  present: boolean;
  created_at: string;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  percentage: number;
}
