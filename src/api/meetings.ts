import { api } from "./client";

export interface MeetingSession {
  id: string;
  teacher_id: string;
  schedule_id: string | null;
  subject: string;
  meet_code: string;
  status: "live" | "ended";
  started_at: string;
  ended_at: string | null;
}

export interface JoinedMeetingData {
  session_id: string;
  meet_code: string;
  subject: string;
  joined_at: string;
}

export interface Participant {
  student_id: string;
  joined_at: string;
  left_at: string | null;
  students: {
    id: string;
    full_name: string;
    usn: string;
  } | null;
}

/**
 * POST /meetings/start
 * Create a live meeting session. Returns the generated meet_code which
 * is used as the video-call room name.
 */
export async function startMeeting(input: {
  teacher_id: string;
  schedule_id?: string;
  subject?: string;
}): Promise<MeetingSession> {
  const response = await api<{
    success: boolean;
    data: MeetingSession;
  }>("/meetings/start", {
    method: "POST",
    body: input,
  });

  return response.data;
}

/**
 * POST /meetings/join
 * Record that a student joined a live meeting (idempotent). The student
 * is later auto-marked "Present" when the teacher ends the meeting.
 */
export async function joinMeeting(input: {
  meet_code: string;
  student_id: string;
}): Promise<JoinedMeetingData> {
  const response = await api<{
    success: boolean;
    data: JoinedMeetingData;
  }>("/meetings/join", {
    method: "POST",
    body: input,
  });

  return response.data;
}

/**
 * POST /meetings/end
 * End a live meeting and auto-mark attendance as "Present" for every
 * participant who joined. Non-joiners are left untouched.
 */
export async function endMeeting(input: {
  meet_code: string;
  teacher_id: string;
}): Promise<{
  ended_at: string;
  attendance_marked: number;
  meet_code: string;
  subject: string;
}> {
  const response = await api<{
    success: boolean;
    data: {
      ended_at: string;
      attendance_marked: number;
      meet_code: string;
      subject: string;
    };
  }>("/meetings/end", {
    method: "POST",
    body: input,
  });

  return response.data;
}

/**
 * GET /meetings/teacher/:teacherId
 * All meetings hosted by a teacher (for attendance history).
 */
export async function getTeacherMeetings(
  teacherId: string
): Promise<MeetingSession[]> {
  const response = await api<{
    success: boolean;
    data: MeetingSession[];
  }>(`/meetings/teacher/${teacherId}`);

  return response.data;
}

export interface StudentMeetingRecord extends MeetingSession {
  /** `true` if this student joined the meeting (presence). */
  joined: boolean;
  joined_at: string | null;
}

/**
 * GET /meetings/student/:studentId/history
 * All meetings (past + live) for a student's teachers, each tagged with
 * whether this student joined. Powers the student call-log screen.
 */
export async function getStudentMeetings(
  studentId: string
): Promise<StudentMeetingRecord[]> {
  const response = await api<{
    success: boolean;
    data: StudentMeetingRecord[];
  }>(`/meetings/student/${studentId}/history`);

  return response.data;
}

/**
 * GET /meetings/student/:studentId
 * Live meetings for the student's teacher(s) — used for "Live Now" badge.
 */
export async function getStudentLiveMeetings(
  studentId: string
): Promise<MeetingSession[]> {
  const response = await api<{
    success: boolean;
    data: MeetingSession[];
  }>(`/meetings/student/${studentId}`);

  return response.data;
}

/**
 * GET /meetings/:code/participants
 * List all students who joined a meeting.
 */
export async function getMeetingParticipants(
  code: string
): Promise<Participant[]> {
  const response = await api<{
    success: boolean;
    data: Participant[];
  }>(`/meetings/${code}/participants`);

  return response.data;
}

/**
 * GET /meetings/:code
 * Fetch a meeting session by its meet code.
 */
export async function getMeetingByCode(
  code: string
): Promise<MeetingSession> {
  const response = await api<{
    success: boolean;
    data: MeetingSession;
  }>(`/meetings/${code}`);

  return response.data;
}
