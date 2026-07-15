import { api } from "./client";

export async function getUserRole(
  authUserId: string
) {
  const response = await api<{
    success: boolean;
    data: {
      role: "teacher" | "student";
    };
  }>(
    `/auth/role?auth_user_id=${authUserId}`
  );

  return response.data;
}