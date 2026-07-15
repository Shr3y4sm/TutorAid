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

export async function createStudent(
  student: {
    teacherId: string;
    full_name: string;
    class: string;
    parent_name?: string;
    parent_phone?: string;
    email?: string;
    phone?: string;
    roll_no?: string;
  }
) {
  const response = await api<{
    success: boolean;
    data: TeacherStudent;
  }>("/teacher/students", {
    method: "POST",
    body: JSON.stringify(student),
  });

  return response.data;
}