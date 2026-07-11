import { api } from "./client";

import {
  TeacherAttendanceResponse,
} from "@/features/teacher/attendance/types/attendance";

export async function getTeacherAttendance() {
  const response =
    await api<TeacherAttendanceResponse>(
      "/teacher/attendance"
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