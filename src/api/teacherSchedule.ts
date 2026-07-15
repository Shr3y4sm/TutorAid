import { api } from "./client";

import {
  TeacherScheduleResponse,
} from "@/features/teacher/schedule/types/schedule";

export async function getTeacherSchedule(
  teacherId: string
) {
  const response =
    await api<TeacherScheduleResponse>(
      `/teacher/schedule?teacherId=${teacherId}`
    );

  return response.data;
}