import { api } from "./client";

export interface StudentDashboardResponse {
  success: boolean;

  data: {
    student: any;
    attendance: number;
    todaysClasses: any[];
    announcements: any[];
  };
}

export interface StudentSchedule {
  id: string;
  subject: string;
  section: string;
  room: string;
  day: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
  teachers?: {
    full_name: string;
  };
  call_id?: string | null;
}

export async function getStudentDashboard(
  studentId: string
) {
  const response =
    await api<StudentDashboardResponse>(
      `/student/dashboard?studentId=${studentId}`
    );

  return response.data;
}

export async function getStudentSchedule(
  studentId: string
): Promise<StudentSchedule[]> {
  const response = await api<{
    success: boolean;
    data: StudentSchedule[];
  }>(
    `/student/schedule?studentId=${studentId}`
  );

  return response.data ?? [];
}