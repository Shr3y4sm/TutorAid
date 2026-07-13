export interface TeacherStudent {
  id: string;

  teacher_id: string;

  full_name: string;

  roll_no: string;

  course: string | null;

  year: string | null;

  semester: number | null;

  section: string | null;

  email: string | null;

  phone: string | null;

  profile_image: string | null;

  created_at: string;
}

export interface TeacherStudentsResponse {
  success: boolean;
  data: TeacherStudent[];
}