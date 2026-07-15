export interface TeacherAssignment {
  id: string;

  teacher_id: string;

  title: string;

  description: string | null;

  subject: string | null;

  due_date: string;

  status: string;

  max_marks: number;

  created_at: string;
}

export interface TeacherAssignmentsResponse {
  success: boolean;
  data: TeacherAssignment[];
}

export interface TeacherAssignmentCreate {
  teacher_id: string;
  title: string;
  description: string;
  subject: string;
  due_date: string;
  max_marks: number;
}