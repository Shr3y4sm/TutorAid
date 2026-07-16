import { api } from "./client";

export async function getUserRole(authUserId: string) {
  const response = await api<{
    success: boolean;
    data: {
      role: "teacher" | "student";
    };
  }>(`/auth/role?auth_user_id=${authUserId}`);

  return response.data;
}
export async function getAuthStatus(
  authUserId: string
) {
  return api<{
    success: boolean;
    role: "teacher" | "student" | null;
    profileExists: boolean;
  }>(
    `/auth/status?auth_user_id=${authUserId}`
  );
}
export interface TeacherLookupResponse {
  id: string;
  full_name: string;
  subjects: string;
  organization: string;
  teacher_code: string;
}

export async function searchTeacher(code: string) {
  const response = await api<{
    success: boolean;
    data: TeacherLookupResponse;
  }>(`/auth/teacher/${code}`);

  return response.data;
}

export interface RegisterStudentRequest {
  auth_user_id: string;
  full_name: string;
  email: string;
  phone: string;
  class: string;
  parent_name: string;
  parent_phone: string;
  teacher_code: string;
}

export async function registerStudent(
  payload: RegisterStudentRequest
) {
  const response = await api<{
    success: boolean;
    data: any;
  }>("/auth/student", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response;
}