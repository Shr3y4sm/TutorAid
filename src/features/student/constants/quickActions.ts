import { Ionicons } from "@expo/vector-icons";

export const quickActions = [
  {
    id: "1",
    title: "Join Class",
    icon: "videocam-outline",
    color: "#EF4444",
  },
  {
    id: "2",
    title: "Courses",
    icon: "book-outline",
    color: "#2563EB",
  },
  {
    id: "3",
    title: "Assignments",
    icon: "document-text-outline",
    color: "#10B981",
  },
  {
    id: "4",
    title: "AI Tutor",
    icon: "sparkles-outline",
    color: "#8B5CF6",
  },
  {
    id: "5",
    title: "Schedule",
    icon: "calendar-outline",
    color: "#F59E0B",
  },
  {
    id: "6",
    title: "Resources",
    icon: "library-outline",
    color: "#0EA5E9",
  },
  {
    id: "7",
    title: "Class History",
    icon: "time-outline",
    color: "#64748B",
  },
] as const;

export type QuickAction = (typeof quickActions)[number];