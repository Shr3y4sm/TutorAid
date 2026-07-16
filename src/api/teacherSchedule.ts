import { api } from "./client";

import {
  TeacherSchedule,
  TeacherScheduleResponse,
} from "@/features/teacher/schedule/types/schedule";

export async function getTeacherSchedule(
  teacherId: string
): Promise<TeacherSchedule[]> {
  const response =
    await api<TeacherScheduleResponse>(
      `/teacher/schedule?teacherId=${teacherId}`
    );

  return response.data ?? [];
}

export async function createSchedule(
  schedule: {
    teacher_id: string;
    subject: string;
    section: string;
    room: string;
    day: string;
    start_time: string;
    end_time: string;
    call_id?: string | null;
  }
): Promise<TeacherSchedule> {
  const response = await api<{
    success: boolean;
    data: TeacherSchedule;
  }>("/teacher/schedule", {
    method: "POST",
    body: JSON.stringify(schedule),
  });

  return response.data;
}

export async function updateSchedule(
  id: string,
  schedule: {
    subject: string;
    section: string;
    room: string;
    day: string;
    start_time: string;
    end_time: string;
    call_id?: string | null;
  }
): Promise<TeacherSchedule> {
  const response = await api<{
    success: boolean;
    data: TeacherSchedule;
  }>(`/teacher/schedule/${id}`, {
    method: "PUT",
    body: JSON.stringify(schedule),
  });

  return response.data;
}

export async function deleteSchedule(
  id: string
): Promise<void> {
  await api(`/teacher/schedule/${id}`, {
    method: "DELETE",
  });
}