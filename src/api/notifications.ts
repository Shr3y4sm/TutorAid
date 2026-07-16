import { api } from "./client";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export async function getNotifications(
  studentId: string
): Promise<Notification[]> {
  const response = await api<{
    success: boolean;
    data: Notification[];
  }>(
    `/notifications?studentId=${studentId}`
  );

  return response.data ?? [];
}

export async function markNotificationRead(
  id: string
) {
  return api(
    `/notifications/${id}/read`,
    {
      method: "PUT",
    }
  );
}