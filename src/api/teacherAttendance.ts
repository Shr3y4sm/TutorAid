import { api } from "./client";

export interface TeacherAttendance {
  id: string;
  name: string;
  rollNo: string;
  present: boolean;
}

export async function getTeacherAttendance(
  teacherId: string
): Promise<TeacherAttendance[]> {
  const response = await api<{
    success: boolean;
    data: TeacherAttendance[];
  }>(
    `/teacher/attendance?teacherId=${teacherId}`
  );

  return response.data;
}

export async function markAttendance(
  attendance: {
    id: string;
    present: boolean;
    marked_by: string;
  }
) {
  const response = await api<{
    success: boolean;
    data: any;
  }>("/teacher/attendance", {
    method: "POST",
    body: JSON.stringify(attendance),
  });

  return response.data;
}

export async function updateAttendance(
  id: string,
  present: boolean
) {
  const response = await api<{
    success: boolean;
    data: any;
  }>(
    `/teacher/attendance/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({
        present,
      }),
    }
  );

  return response.data;
}

export async function deleteAttendance(
  id: string
) {
  return api(
    `/teacher/attendance/${id}`,
    {
      method: "DELETE",
    }
  );
}