import { api } from "./client";

import {
  Attendance,
  AttendanceSummary,
} from "@/types/attendance";

export async function markAttendance(
  input: {
    studentId: string;
    teacherId: string;
    /** YYYY-MM-DD */
    classDate: string;
    present: boolean;
  }
): Promise<Attendance> {

  const response = await api<{
    success: boolean;
    data: Attendance;
  }>("/attendance", {
    method: "POST",
    body: {
      studentId: input.studentId,
      teacherId: input.teacherId,
      classDate: input.classDate,
      present: input.present,
    },
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

export async function getStudentAttendance(
  studentId: string
): Promise<Attendance[]> {

  const response = await api<{
    success: boolean;
    data: Attendance[];
  }>(`/attendance/student/${studentId}`);

  return response.data ?? [];
}

export async function getAttendanceSummary(
  studentId: string
): Promise<AttendanceSummary> {

  const response = await api<{
    success: boolean;
    data: AttendanceSummary;
  }>(`/attendance/summary/${studentId}`);

  return (
    response.data ?? {
      total: 0,
      present: 0,
      absent: 0,
      percentage: 0,
    }
  );
}

export async function updateAttendance(
  id: string,
  present: boolean
): Promise<Attendance> {

  const response = await api<{
    success: boolean;
    data: Attendance;
  }>(`/attendance/${id}`, {
    method: "PATCH",
    body: { present },
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