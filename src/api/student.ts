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

export async function getStudentDashboard(
  studentId: string
) {
  const response =
    await api<StudentDashboardResponse>(
      `/student/dashboard?studentId=${studentId}`
    );

  return response.data;
}