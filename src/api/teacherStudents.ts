import { api } from "./client";
import { TeacherStudent } from "@/features/teacher/students/types/student";

export async function getTeacherStudents(
  teacherId: string
) {
  const response = await api<{
    success: boolean;
    data: TeacherStudent[];
  }>(
    `/teacher/students?teacherId=${teacherId}`
  );

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

export async function getStudent(
  id: string
) {
  const response = await api<{
    success: boolean;
    data: TeacherStudent;
  }>(`/teacher/students/${id}`);

  return response.data;
}

export async function updateStudent(
  id: string,
  student: {
    full_name: string;
    class: string;
    roll_no?: string;
    email?: string;
    phone?: string;
    parent_name?: string;
    parent_phone?: string;
  }
) {
  const response = await api<{
    success: boolean;
    data: TeacherStudent;
  }>(`/teacher/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });

  return response.data;
}

export async function deleteStudent(
  id: string
) {
  return api(`/teacher/students/${id}`, {
    method: "DELETE",
  });
}
