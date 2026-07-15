export interface TeacherSchedule {
  id: string;

  teacher_id: string;

  subject: string;

  section: string;

  room: string;

  start_time: string;

  end_time: string;
}

export interface TeacherScheduleResponse {
  success: boolean;
  data: TeacherSchedule[];
}