import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getTeacherAttendance(
  req: Request,
  res: Response
) {
  try {
    const teacherId = req.query.teacherId as string;

    const { data, error } = await supabase
      .from("teacher_students")
      .select(`
        student:students(
          id,
          full_name,
          roll_no
        )
      `)
      .eq("teacher_id", teacherId);

    if (error) throw error;

    const students = (data ?? []).map(
      (row: any) => ({
        id: row.student.id,
        name: row.student.full_name,
        rollNo: row.student.roll_no ?? "-",
        present: false,
      })
    );

    res.json({
      success: true,
      data: students,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function markAttendance(
  req: Request,
  res: Response
) {
  try {
    const {
      id,
      present,
    } = req.body;

    const today =
      new Date().toISOString().split("T")[0];

    const { data: existing } =
      await supabase
        .from("attendance")
        .select("id")
        .eq("student_id", id)
        .eq("class_date", today)
        .maybeSingle();

    if (existing) {
      const { data, error } =
        await supabase
          .from("attendance")
          .update({
            present,
          })
          .eq("id", existing.id)
          .select()
          .single();

      if (error) throw error;

      return res.json({
        success: true,
        data,
      });
    }

    const { data, error } =
      await supabase
        .from("attendance")
        .insert({
          student_id: id,
          class_date: today,
          present,
          marked_by:
            req.body.marked_by,
        })
        .select()
        .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function updateAttendance(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;
    const { present } = req.body;

    const { data, error } =
      await supabase
        .from("attendance")
        .update({
          present,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function deleteAttendance(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const { error } =
      await supabase
        .from("attendance")
        .delete()
        .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}