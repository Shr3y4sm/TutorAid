export interface TeacherSchedule {
  id: number;
  subject: string;
  section: string;
  room: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface TeacherScheduleResponse {
  success: boolean;
  data: TeacherSchedule[];
}