import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getAssignments(
  req: Request,
  res: Response
) {
  try {
    const studentId = req.query.studentId as string;

    const { data, error } = await supabase
      .from("student_courses")
      .select(`
        course_id,
        courses!inner(
          assignments(*)
        )
      `)
      .eq("student_id", studentId);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const assignments =
      data.flatMap(
        (x: any) => x.courses.assignments
      );

    res.json({
      success: true,
      data: assignments,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}