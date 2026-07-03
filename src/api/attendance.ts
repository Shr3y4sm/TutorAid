import { api } from "./client";
import { AttendanceResponse } from "@/features/attendance/types/attendance";

export async function getAttendance() {
  const response = await api<AttendanceResponse>("/attendance");
  return response.data;
}