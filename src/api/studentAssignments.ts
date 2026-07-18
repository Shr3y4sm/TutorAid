import { api } from "./client";

export async function getStudentAssignments(
  studentId: string
) {
  const response = await api<{
    success: boolean;
    data: any[];
  }>(
    `/student/assignments?studentId=${studentId}`
  );

  return response.data;
}

export async function getStudentAssignment(
  id: string
) {
  const response = await api<{
    success: boolean;
    data: any;
  }>(
    `/student/assignments/${id}`
  );

  return response.data;
}

export async function submitAssignment(
    assignmentId: string,
    body: {
        student_id: string;
        file_url: string;
        remarks: string;
    }
) {
    const response = await api(
        `/student/assignments/${assignmentId}/submit`,
        {
            method: "POST",
            body
        }
    );

    return response;
}