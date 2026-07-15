import { api } from "./client";
import { TeacherAssignment } from "@/features/teacher/assignments/types/assignment";

export async function getTeacherAssignments(
  teacherId: string
): Promise<TeacherAssignment[]> {
  const response = await api<{
    success: boolean;
    data: TeacherAssignment[];
  }>(
    `/teacher/assignments?teacherId=${teacherId}`
  );

  return response.data;
}