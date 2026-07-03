export interface TeacherStats {
  todayClasses: number;
  totalStudents: number;
  pendingAssignments: number;
  attendanceToday: number;
}

export interface QuickAction {
  id: number;
  title: string;
  icon: string;
}

export interface TodayClass {
  id: number;
  subject: string;
  section: string;
  room: string;
  time: string;
}

export interface Activity {
  id: number;
  text: string;
}

export interface TeacherDashboard {
  teacher: {
    name: string;
    subject: string;
  };

  stats: TeacherStats;

  quickActions: QuickAction[];

  todayClasses: TodayClass[];

  recentActivity: Activity[];
}

export interface TeacherDashboardResponse {
  success: boolean;
  data: TeacherDashboard;
}