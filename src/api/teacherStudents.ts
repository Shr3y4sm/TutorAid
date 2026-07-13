import { api } from "./client";
import { TeacherStudent } from "@/features/teacher/students/types/student";

export async function getTeacherStudents(
  teacherId: string
): Promise<TeacherStudent[]> {
  const response = await api<{
    success: boolean;
    data: TeacherStudent[];
  }>(`/teacher/students?teacherId=${teacherId}`);

  return response.data;
}