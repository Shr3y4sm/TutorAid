import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getTeacherStudents(
  req: Request,
  res: Response
) {
  try {
    const teacherId = req.query.teacherId as string;

    const { data, error } = await supabase
      .from("teacher_students")
      .select(`
        student:students (
          id,
          full_name,
          email,
          phone,
          class,
          roll_no,
          parent_name,
          parent_phone,
          profile_image
        )
      `)
      .eq("teacher_id", teacherId);

    if (error) throw error;

    res.status(200).json({
      success: true,
      data: data.map((row: any) => row.student),
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function createStudent(
  req: Request,
  res: Response
) {
  try {
    const {
      teacherId,
      full_name,
      class: studentClass,
      parent_name,
      parent_phone,
      email,
      phone,
      roll_no,
    } = req.body;

    // 1. Create student
    const { data: student, error } =
      await supabase
        .from("students")
        .insert({
          full_name,
          class: studentClass,
          parent_name,
          parent_phone,
          email,
          phone,
          roll_no,
        })
        .select()
        .single();

    if (error) throw error;

    // 2. Link teacher and student
    const { error: linkError } =
      await supabase
        .from("teacher_students")
        .insert({
          teacher_id: teacherId,
          student_id: student.id,
        });

    if (linkError) throw linkError;

    res.status(201).json({
      success: true,
      data: student,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}