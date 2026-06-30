import {
  AnnouncementItem,
  ClassItem,
} from "../types/dashboard";

export const todaysClasses: ClassItem[] = [
  {
    id: "1",
    subject: "Artificial Intelligence",
    teacher: "Dr. Rao",
    time: "09:00 AM",
    room: "Room A-203",
  },
  {
    id: "2",
    subject: "Machine Learning",
    teacher: "Prof. Sharma",
    time: "11:00 AM",
    room: "Lab ML-2",
  },
  {
    id: "3",
    subject: "Operating Systems",
    teacher: "Dr. Kumar",
    time: "02:00 PM",
    room: "Room C-110",
  },
];

export const announcements: AnnouncementItem[] = [
  {
    id: "1",
    title: "Assignment Due",
    description: "Machine Learning Assignment 3 is due tomorrow.",
    date: "Today",
  },
  {
    id: "2",
    title: "Live Class",
    description: "AI Lab has been shifted to 2:00 PM.",
    date: "Today",
  },
];