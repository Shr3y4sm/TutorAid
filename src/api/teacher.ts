import { api } from "./client";

import { TeacherDashboardResponse } from "@/features/teacher/types/teacher";

export async function getTeacherDashboard() {
  const response =
    await api<TeacherDashboardResponse>(
      "/teacher/dashboard"
    );

  return response.data;
}