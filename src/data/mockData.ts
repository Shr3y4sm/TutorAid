export const dashboard = {
  attendance: 91,
  semester: 6,
  branch: "Artificial Intelligence & ML",
  todaysClasses: [
    {
      id: "1",
      subject: "Artificial Intelligence",
      teacher: "Dr. Rao",
      time: "09:00 AM",
      room: "A-203",
    },
    {
      id: "2",
      subject: "Machine Learning",
      teacher: "Prof. Sharma",
      time: "11:00 AM",
      room: "ML Lab",
    },
    {
      id: "3",
      subject: "Operating Systems",
      teacher: "Dr. Kumar",
      time: "02:00 PM",
      room: "C-110",
    },
  ],
  announcements: [
    {
      id: "1",
      title: "Assignment Due",
      description: "ML Assignment 3 due tomorrow.",
      date: "Today",
    },
    {
      id: "2",
      title: "Lab Shifted",
      description: "AI Lab starts at 2 PM.",
      date: "Today",
    },
  ],
};

export const courses = [
  {
    id: "ai",
    title: "Artificial Intelligence",
    instructor: "Dr. Rao",
    progress: 82,
    students: 32,
    color: "#2563EB",
  },
  {
    id: "ml",
    title: "Machine Learning",
    instructor: "Prof. Sharma",
    progress: 68,
    students: 28,
    color: "#10B981",
  },
  {
    id: "os",
    title: "Operating Systems",
    instructor: "Dr. Kumar",
    progress: 94,
    students: 35,
    color: "#F59E0B",
  },
];

export const assignments = [
  {
    id: "1",
    title: "ML Assignment 3",
    subject: "Machine Learning",
    dueDate: "2026-07-05",
    status: "Pending",
  },
  {
    id: "2",
    title: "AI Mini Project",
    subject: "Artificial Intelligence",
    dueDate: "2026-07-10",
    status: "Submitted",
  },
];