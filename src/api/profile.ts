import { api } from "./client";

export interface StudentProfile {
  id: string;
  full_name: string;
  roll_no: string;
  email: string | null;
  phone: string | null;
  semester: number | null;
  year: string | null;
  section: string | null;
  course: string | null;
  profile_image: string | null;
}
interface ProfileResponse {
  success: boolean;
  data: StudentProfile;
}

import { getCurrentStudentId } from "@/services/studentService";

export async function getStudentProfile() {
  const studentId =
    await getCurrentStudentId();

  const response =
    await api<ProfileResponse>(
      `/student/profile?studentId=${studentId}`
    );

  return response.data;
}
