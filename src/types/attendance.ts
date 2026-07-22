export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "Leave";

export interface Attendance {

  id: string;

  student_id: string;

  marked_by: string;

  attendance_date: string;

  status: AttendanceStatus;

  remarks?: string;

  created_at: string;

}

export interface AttendanceSummary {

  total: number;

  present: number;

  absent: number;

  late: number;

  leave: number;

  percentage: number;

}

export interface AttendanceCreate {

  studentId: string;

  teacherId: string;

  attendanceDate: string;

  status: AttendanceStatus;

  remarks?: string;

}