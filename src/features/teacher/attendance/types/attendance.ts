export interface TeacherAttendance {
  id: number;
  rollNo: string;
  name: string;
  present: boolean;
}

export interface TeacherAttendanceResponse {
  success: boolean;
  data: TeacherAttendance[];
}