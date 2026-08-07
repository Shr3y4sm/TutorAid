import { api } from "./client";

import {
  TeacherAssignment,
  TeacherAssignmentCreate,
} from "@/features/teacher/assignments/types/assignment";

export async function getTeacherAssignments(
  teacherId: string
): Promise<TeacherAssignment[]> {
  const response = await api<{
    success: boolean;
    data: TeacherAssignment[];
  }>(`/teacher/assignments?teacherId=${teacherId}`);

  return response.data;
}

export async function createAssignment(
  assignment: TeacherAssignmentCreate
): Promise<TeacherAssignment> {
  const response = await api<{
    success: boolean;
    data: TeacherAssignment;
  }>("/teacher/assignments", {
    method: "POST",
    body: assignment,
  });

  return response.data;
}

export async function updateAssignment(
  id: string,
  assignment: TeacherAssignmentCreate
) {
  const response = await api<{
    success: boolean;
    data: TeacherAssignment;
  }>(`/teacher/assignments/${id}`, {
    method: "PUT",
    body: assignment,
  });

  return response.data;
}

export async function deleteAssignment(
  id: string
) {
  await api(
    `/teacher/assignments/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function getAssignmentStudents(
  assignmentId: string
) {
  const response = await api<{
    success: boolean;
    data: any[];
  }>(
    `/teacher/assignments/${assignmentId}/students`
  );

  return response.data;
}
export interface TeacherSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  submitted_at: string;
  file_url?: string | null;
  marks?: number | null;
  feedback?: string | null;
  status: string;
  student: {
    id: string;
    full_name: string;
    class: string;
    roll_no?: string;
  };
}

export async function getAssignmentSubmissions(
  assignmentId: string
): Promise<TeacherSubmission[]> {
  const response = await api<{
    success: boolean;
    data: TeacherSubmission[];
  }>(
    `/teacher/assignments/${assignmentId}/submissions`
  );

  return response.data;
}
