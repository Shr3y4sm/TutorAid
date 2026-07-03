import { api } from "./client";

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  department: string;
  semester: number;
  avatarInitials: string;
  academic: {
    cgpa: number;
    attendancePercentage: number;
    creditsCompleted: number;
    currentSemester: number;
  };
  contact: {
    email: string;
    phone: string;
  };
  guardian: {
    name: string;
    phone: string;
  };
  statistics: {
    assignmentsSubmitted: number;
    pendingAssignments: number;
    coursesEnrolled: number;
    certificates: number;
  };
}

interface ProfileResponse {
  success: boolean;
  data: StudentProfile;
}

export async function getStudentProfile() {
  const response =
    await api<ProfileResponse>("/student/profile");

  return response.data;
}
