import { api } from "./client";

import {
  Attendance,
  AttendanceCreate,
  AttendanceSummary,
} from "@/types/attendance";

export async function markAttendance(
  attendance: AttendanceCreate
): Promise<Attendance> {

  const response = await api<{
    success: boolean;
    data: Attendance;
  }>("/attendance", {
    method: "POST",
    body: attendance,
  });

  return response.data;
}

export async function getAttendance(
  date: string
): Promise<Attendance[]> {

  const response = await api<{
    success: boolean;
    data: Attendance[];
  }>(`/attendance?date=${date}`);

  return response.data;
}

export async function updateAttendance(
  id: string,
  status: string,
  remarks?: string
): Promise<Attendance> {

  const response = await api<{
    success: boolean;
    data: Attendance;
  }>(`/attendance/${id}`, {
    method: "PATCH",
    body: {
      status,
      remarks,
    },
  });

  return response.data;
}

export async function deleteAttendance(
  id: string
) {

  await api(`/attendance/${id}`, {
    method: "DELETE",
  });

}

export async function getStudentAttendance(
  studentId: string
): Promise<Attendance[]> {

  const response = await api<{
    success: boolean;
    data: Attendance[];
  }>(`/attendance/student/${studentId}`);

  return response.data;
}

export async function getAttendanceSummary(
  studentId: string
): Promise<AttendanceSummary> {

  const response = await api<{
    success: boolean;
    data: AttendanceSummary;
  }>(`/attendance/summary/${studentId}`);

  return response.data;
}