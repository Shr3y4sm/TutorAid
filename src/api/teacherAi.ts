import { api } from "./client";

import {
  TeacherAiResponse,
} from "@/features/teacher/ai/types/ai";

export async function getTeacherAiTools() {
  const response =
    await api<TeacherAiResponse>(
      "/teacher/ai"
    );

  return response.data;
}