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
    body: JSON.stringify(assignment),
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
    body: JSON.stringify(assignment),
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