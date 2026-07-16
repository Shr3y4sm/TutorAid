export interface Teacher {
  name: string;
  subject: string;
  teacherCode: string;
}

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

export interface TeacherDashboardData {
  teacher: Teacher;
  stats: TeacherStats;
  quickActions: QuickAction[];
  todayClasses: TodayClass[];
  recentActivity: Activity[];
}

export interface TeacherDashboardResponse {
  success: boolean;
  data: TeacherDashboardData;
}