import { api } from "./client";
import { NotificationsResponse } from "@/features/notifications/types/notification";

export async function getNotifications() {
  const response =
    await api<NotificationsResponse>("/notifications");

  return response.data;
}