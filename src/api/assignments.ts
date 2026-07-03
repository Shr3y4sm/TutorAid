import { api } from "./client";

export type AssignmentStatus =
  | "Pending"
  | "Submitted"
  | "Overdue";

export interface Assignment {
  id: string;
  title: string;
  course: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  maxMarks: number;
  obtainedMarks: number | null;
}

interface AssignmentResponse {
  success: boolean;
  data: Assignment[];
}

export async function getAssignments() {
  const response =
    await api<AssignmentResponse>("/assignments");

  return response.data;
}
