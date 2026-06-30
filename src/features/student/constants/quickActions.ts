import { Ionicons } from "@expo/vector-icons";

export const quickActions = [
  {
    id: "1",
    title: "Courses",
    icon: "book-outline",
    color: "#2563EB",
  },
  {
    id: "2",
    title: "Assignments",
    icon: "document-text-outline",
    color: "#10B981",
  },
  {
    id: "3",
    title: "AI Tutor",
    icon: "sparkles-outline",
    color: "#8B5CF6",
  },
  {
    id: "4",
    title: "Schedule",
    icon: "calendar-outline",
    color: "#F59E0B",
  },
] as const;

export type QuickAction = (typeof quickActions)[number];