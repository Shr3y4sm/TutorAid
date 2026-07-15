import { api } from "./client";

import {
  TeacherAttendanceResponse,
} from "@/features/teacher/attendance/types/attendance";

export async function getTeacherAttendance(
  teacherId: string
) {
  const response =
    await api<TeacherAttendanceResponse>(
      `/teacher/attendance?teacherId=${teacherId}`
    );

  return response.data;
}

export async function markAttendance(
  id: number,
  present: boolean
) {
  return api("/teacher/attendance/mark", {
    method: "POST",
    body: JSON.stringify({
      id,
      present,
    }),
  });
}