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

export async function createSchedule(
  schedule: any
) {
  const response = await api<{
    success: boolean;
    data: any;
  }>("/teacher/schedule", {
    method: "POST",
    body: JSON.stringify(schedule),
  });

  return response.data;
}

export async function updateSchedule(
  id: string,
  schedule: any
) {
  const response = await api<{
    success: boolean;
    data: any;
  }>(`/teacher/schedule/${id}`, {
    method: "PUT",
    body: JSON.stringify(schedule),
  });

  return response.data;
}

export async function deleteSchedule(
  id: string
) {
  await api(
    `/teacher/schedule/${id}`,
    {
      method: "DELETE",
    }
  );
}