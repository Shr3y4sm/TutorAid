import { api } from "./client";

export interface ClassNote {
  id: string;
  teacher_id: string;
  student_id: string | null;
  meet_code: string;
  body: string;
  created_at: string;
}

/** POST /class-notes — write an in-class pointer note (teacher). */
export async function createClassNote(input: {
  teacher_id: string;
  meet_code: string;
  body: string;
  student_id?: string | null;
}): Promise<ClassNote> {
  const response = await api<{
    success: boolean;
    data: ClassNote;
  }>("/class-notes", {
    method: "POST",
    body: input,
  });

  return response.data;
}

/** GET /class-notes/meeting/:meetCode — notes for one live class. */
export async function getMeetingNotes(
  meetCode: string
): Promise<ClassNote[]> {
  const response = await api<{
    success: boolean;
    data: ClassNote[];
  }>(`/class-notes/meeting/${meetCode}`);

  return response.data ?? [];
}

/** GET /class-notes/student/:studentId — per-student notes record. */
export async function getStudentNotes(
  studentId: string
): Promise<ClassNote[]> {
  const response = await api<{
    success: boolean;
    data: ClassNote[];
  }>(`/class-notes/student/${studentId}`);

  return response.data ?? [];
}

/** DELETE /class-notes/:id — remove a note. */
export async function deleteClassNote(id: string): Promise<void> {
  await api(`/class-notes/${id}`, {
    method: "DELETE",
  });
}