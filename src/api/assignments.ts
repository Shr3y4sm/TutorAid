import { api } from "./client";
import { TeacherAssignment } from "@/features/teacher/assignments/types/assignment";

export async function getAssignments(
  studentId: string
): Promise<TeacherAssignment[]> {
  const response = await api<{
    success: boolean;
    data: TeacherAssignment[];
  }>(
    `/assignments?studentId=${studentId}`
  );

  return response.data;
}