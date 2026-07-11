export interface TeacherAssignment {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: string;
}

export interface TeacherAssignmentsResponse {
  success: boolean;
  data: TeacherAssignment[];
}