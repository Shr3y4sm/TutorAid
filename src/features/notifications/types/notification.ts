export type NotificationType =
  | "assignment"
  | "course"
  | "attendance"
  | "announcement"
  | "system";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}