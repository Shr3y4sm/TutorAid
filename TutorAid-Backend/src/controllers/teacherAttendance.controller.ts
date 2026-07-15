import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getTeacherAttendance(
  req: Request,
  res: Response
) {
  try {
    const teacherId = req.query.teacherId as string;

    const { data, error } = await supabase
      .from("attendance")
      .select(`
        id,
        present,
        class_date,
        student:students!attendance_student_id_fkey(
          id,
          full_name,
          roll_no,
          teacher_id
        )
      `);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const result = data
      .filter(
        (row: any) =>
          row.student &&
          row.student.teacher_id === teacherId
      )
      .map((row: any) => ({
        id: row.id,
        student_id: row.student.id,
        name: row.student.full_name,
        rollNo: row.student.roll_no,
        present: row.present,
      }));

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function markAttendance(
  req: Request,
  res: Response
) {
  try {
    const { id, present } = req.body;

    const { error } = await supabase
      .from("attendance")
      .update({
        present,
      })
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
    });
  } catch {
    res.status(500).json({
      success: false,
    });
  }
}