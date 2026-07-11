import { api } from "./client";

import {
  TeacherAssignmentsResponse,
} from "@/features/teacher/assignments/types/assignment";

export async function getTeacherAssignments() {
  const response =
    await api<TeacherAssignmentsResponse>(
      "/teacher/assignments"
    );

  return response.data;
}