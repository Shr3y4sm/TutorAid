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