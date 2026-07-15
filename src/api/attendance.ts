import { api } from "./client";
import { AttendanceResponse } from "@/features/attendance/types/attendance";

export async function getAttendance(
  studentId: string
) {
  const response =
    await api<AttendanceResponse>(
      `/attendance?studentId=${studentId}`
    );

  return response.data;
}