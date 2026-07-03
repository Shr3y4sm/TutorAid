export const dashboard = {
  student: {
    id: "student1",
    name: "Shreyas",
    usn: "1RV22AI001",
    semester: 6,
    branch: "Artificial Intelligence & Machine Learning",
    attendance: 91,
  },

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
      description: "Machine Learning Assignment-3 is due tomorrow.",
      date: "Today",
    },
    {
      id: "2",
      title: "Lab Timing Changed",
      description: "AI Lab starts at 2 PM today.",
      date: "Today",
    },
  ],
};

export const profile = {
  id: "student1",
  name: "Shreyas",
  studentId: "1RV22AI001",
  department: "Artificial Intelligence & Machine Learning",
  semester: 6,
  avatarInitials: "S",
  academic: {
    cgpa: 8.7,
    attendancePercentage: 91,
    creditsCompleted: 118,
    currentSemester: 6,
  },
  contact: {
    email: "shreyas@student.tutoraid.edu",
    phone: "+91 98765 43210",
  },
  guardian: {
    name: "Ramesh M",
    phone: "+91 98765 12345",
  },
  statistics: {
    assignmentsSubmitted: 14,
    pendingAssignments: 3,
    coursesEnrolled: 5,
    certificates: 2,
  },
};
