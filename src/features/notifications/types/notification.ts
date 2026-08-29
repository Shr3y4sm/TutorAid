export type NotificationType =
  | "assignment"
  | "course"
  | "attendance"
  | "announcement"
  | "schedule"
  | "meeting"
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