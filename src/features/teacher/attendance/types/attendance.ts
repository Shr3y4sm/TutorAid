export interface TeacherAttendance {
  id: string;
  name: string;
  rollNo: string;
  present: boolean;
}

export interface TeacherAttendanceResponse {
  success: boolean;
  data: TeacherAttendance[];
}