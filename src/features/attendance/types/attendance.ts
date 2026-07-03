export interface SubjectAttendance {
  id: number;
  subject: string;
 attended: number;
  total: number;
  percentage: number;
}

export interface AttendanceSummary {
  excellent: number;
  good: number;
  warning: number;
}

export interface AttendanceData {
  overallPercentage: number;
  totalClasses: number;
  attendedClasses: number;
  missedClasses: number;
  summary: AttendanceSummary;
  subjects: SubjectAttendance[];
}

export interface AttendanceResponse {
  success: boolean;
  data: AttendanceData;
}