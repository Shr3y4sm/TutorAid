import { api } from "./client";

import {
  TeacherScheduleResponse,
} from "@/features/teacher/schedule/types/schedule";

export async function getTeacherSchedule() {
  const response =
    await api<TeacherScheduleResponse>(
      "/teacher/schedule"
    );

  return response.data;
}