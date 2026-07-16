import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getTeacherAssignments(
  req: Request,
  res: Response
) {
  try {
    const teacherId = req.query.teacherId as string;

    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", {
        ascending: false,
      });

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

export async function createAssignment(
  req: Request,
  res: Response
) {
  try {
    const {
      teacher_id,
      title,
      description,
      subject,
      due_date,
      max_marks,
      students,
    } = req.body;

    const { data: assignment, error } =
      await supabase
        .from("assignments")
        .insert({
          teacher_id,
          title,
          description,
          subject,
          due_date,
          max_marks,
          status: "Active",
        })
        .select()
        .single();

    if (error) throw error;

    if (students?.length) {
      const links = students.map(
        (studentId: string) => ({
          assignment_id: assignment.id,
          student_id: studentId,
        })
      );

      const { error: linkError } =
        await supabase
          .from("assignment_students")
          .insert(links);

      if (linkError) throw linkError;
    }

    res.status(201).json({
      success: true,
      data: assignment,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}