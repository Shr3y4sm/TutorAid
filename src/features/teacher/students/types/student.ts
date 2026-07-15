export interface TeacherStudent {
  id: string;

  full_name: string;

  email: string | null;

  phone: string | null;

  class: string | null;

  roll_no: string | null;

  parent_name: string | null;

  parent_phone: string | null;

  profile_image: string | null;
}

export interface TeacherStudentsResponse {
  success: boolean;
  data: TeacherStudent[];
}