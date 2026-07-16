import { api } from "./client";

import { AttendanceData } from "@/features/attendance/types/attendance";

export async function getAttendance(
  studentId: string
): Promise<AttendanceData> {
  const response = await api<{
    success: boolean;
    data: AttendanceData;
  }>(`/attendance?studentId=${studentId}`);

  return response.data;
}