import { api } from "./client";

import { ApiResponse } from "@/types/api";

import {
  StudentAssignment,
  Assignment,
} from "@/types/assignment";

export async function getStudentAssignments(
  studentId: string
): Promise<StudentAssignment[]> {
  const response =
    await api<ApiResponse<StudentAssignment[]>>(
      `/student/assignments?studentId=${studentId}`
    );

  return response.data;
}

export async function getStudentAssignment(
  assignmentId: string
): Promise<Assignment> {
  const response =
    await api<ApiResponse<Assignment>>(
      `/student/assignments/${assignmentId}`
    );

  return response.data;
}

export async function submitAssignment(
  assignmentId: string,
  body: {
    student_id: string;
    file_url: string;
  }
): Promise<ApiResponse<null>> {
  return api<ApiResponse<null>>(
    `/student/assignments/${assignmentId}/submit`,
    {
      method: "POST",
      body,
    }
  );
}