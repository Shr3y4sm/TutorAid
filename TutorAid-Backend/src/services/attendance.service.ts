import supabase from "../config/supabase";
import { ApiError } from "../utils/ApiError";

/**
 * Canonical attendance record shape (matches meeting auto-marking,
 * teacher manual marking and the dashboard percentage):
 *   { student_id, class_date (YYYY-MM-DD), present (boolean), marked_by }
 */
export class AttendanceService {

  static async markAttendance(
    studentId: string,
    teacherId: string,
    classDate: string,
    present: boolean
  ) {

    const { data, error } = await supabase
      .from("attendance")
      .upsert(
        {
          student_id: studentId,
          marked_by: teacherId,
          class_date: classDate,
          present,
        },
        {
          onConflict: "student_id,class_date",
        }
      )
      .select()
      .single();

    if (error) throw new ApiError(400, error.message);

    return data;
  }

  static async getAttendanceByDate(
    classDate: string
  ) {

    const { data, error } = await supabase
      .from("attendance")
      .select(`
        *,
        students(
          id,
          full_name,
          usn
        )
      `)
      .eq("class_date", classDate)
      .order("created_at");

    if (error) throw new ApiError(400, error.message);

    return data;
  }

  static async getStudentAttendance(
    studentId: string
  ) {

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId)
      .order("class_date", {
        ascending: false,
      });

    if (error) throw new ApiError(400, error.message);

    return data;
  }

  static async updateAttendance(
    id: string,
    present: boolean
  ) {

    const { data, error } = await supabase
      .from("attendance")
      .update({
        present,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new ApiError(400, error.message);

    return data;
  }

  static async deleteAttendance(
    id: string
  ) {

    const { error } = await supabase
      .from("attendance")
      .delete()
      .eq("id", id);

    if (error) throw new ApiError(400, error.message);
  }

  static async getAttendanceSummary(
    studentId: string
  ) {

    const { data, error } = await supabase
      .from("attendance")
      .select("present")
      .eq("student_id", studentId);

    if (error) throw new ApiError(400, error.message);

    const total = data.length;

    const present =
      data.filter((a: any) => a.present)
        .length;

    const absent = total - present;

    return {
      total,
      present,
      absent,
      percentage:
        total === 0
          ? 0
          : Number(
              (
                (present / total) *
                100
              ).toFixed(2)
            ),
    };
  }

}