import supabase from "../config/supabase";

/**
 * Fire-and-forget notification helpers.
 *
 * Failures are logged but never thrown, so a notification problem
 * can never break the primary operation that triggered it.
 */

export interface NotificationPayload {
  teacher_id?: string;
  title: string;
  message: string;
  type: string;
}

/** All students linked to a teacher through teacher_students. */
export async function getTeacherStudentIds(
  teacherId: string
): Promise<string[]> {
  const { data } = await supabase
    .from("teacher_students")
    .select("student_id")
    .eq("teacher_id", teacherId);

  return ((data as any[]) ?? []).map(
    (row) => row.student_id
  );
}

export async function notifyStudents(
  studentIds: string[],
  payload: NotificationPayload
): Promise<void> {
  try {
    if (!studentIds.length) return;

    await supabase.from("notifications").insert(
      studentIds.map((student_id) => ({
        student_id,
        ...payload,
      }))
    );
  } catch (err) {
    console.warn(
      "notification insert failed:",
      err
    );
  }
}

export async function notifyStudent(
  studentId: string | undefined | null,
  payload: NotificationPayload
): Promise<void> {
  if (!studentId) return;

  await notifyStudents([studentId], payload);
}
