import supabase from "../config/supabase";
import { ApiError } from "../utils/ApiError";

export class AttendanceService {

  static async markAttendance(
    studentId: string,
    teacherId: string,
    attendanceDate: string,
    status: string,
    remarks?: string
  ) {

    const { data, error } = await supabase
      .from("attendance")
      .upsert(
        {
          student_id: studentId,
          marked_by: teacherId,
          attendance_date: attendanceDate,
          status,
          remarks,
        },
        {
          onConflict: "student_id,attendance_date",
        }
      )
      .select()
      .single();

    if (error) throw new ApiError(400, error.message);

    return data;
  }

  static async getAttendanceByDate(
    attendanceDate: string
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
      .eq("attendance_date", attendanceDate)
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
      .order("attendance_date", {
        ascending: false,
      });

    if (error) throw new ApiError(400, error.message);

    return data;
  }

  static async updateAttendance(
    id: string,
    status: string,
    remarks?: string
  ) {

    const { data, error } = await supabase
      .from("attendance")
      .update({
        status,
        remarks,
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
      .select("status")
      .eq("student_id", studentId);

    if (error) throw new ApiError(400, error.message);

    const summary = {
      total: data.length,
      present: data.filter(a => a.status === "Present").length,
      absent: data.filter(a => a.status === "Absent").length,
      late: data.filter(a => a.status === "Late").length,
      leave: data.filter(a => a.status === "Leave").length,
    };

    return {
      ...summary,
      percentage:
        summary.total === 0
          ? 0
          : Number(
              (
                (summary.present / summary.total) *
                100
              ).toFixed(2)
            ),
    };
  }

}