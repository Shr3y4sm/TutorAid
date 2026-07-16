import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getAssignments(
  req: Request,
  res: Response
) {
  try {
    const studentId =
      req.query.studentId as string;

    const { data, error } =
      await supabase
        .from("student_courses")
        .select(`
          course_id,
          courses!inner(
            assignments(*)
          )
        `)
        .eq("student_id", studentId);

    if (error) throw error;

    const assignments = (data ?? []).flatMap(
      (row: any) =>
        row.courses?.assignments ?? []
    );

    res.json({
      success: true,
      data: assignments,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message:
        err.message ??
        "Internal Server Error",
      data: [],
    });
  }
}