import { api } from "./client";
import { TeacherDashboardResponse } from "@/features/teacher/types/teacher";

export async function getTeacherDashboard(
  teacherId: string
) {
  const response =
    await api<TeacherDashboardResponse>(
      `/teacher/dashboard?teacherId=${teacherId}`
    );

  return response.data;
}