export interface Assignment {
  id: string;

  teacher_id: string;

  title: string;

  description: string;

  subject: string;

  due_date: string;

  max_marks: number;

  status: string;

  file_url?: string | null;

  created_at: string;
}

export interface StudentAssignment {
  id: string;

  status: string;

  marks?: number | null;

  feedback?: string | null;

  submitted_at?: string | null;

  assignment: Assignment;
}

export interface AssignmentSubmission {
  id: string;

  assignment_id: string;

  student_id: string;

  submitted_at: string;

  file_url?: string | null;

  marks?: number | null;

  feedback?: string | null;

  status: string;
}