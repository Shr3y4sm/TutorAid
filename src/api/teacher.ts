import { api } from "./client";

import {
  TeacherDashboardResponse,
} from "@/features/teacher/types/teacher";

/**
 * Fetch the current teacher's dashboard.
 *
 * The backend derives the teacher identity from the authenticated user
 * (via req.user in the authenticate middleware), so we no longer send a
 * teacherId as a query parameter.  This closes the IDOR risk where a
 * client could supply an arbitrary teacherId.
 */
export async function getTeacherDashboard() {
  const response =
    await api<TeacherDashboardResponse>(
      `/teacher/dashboard`
    );

  return response.data;
}
