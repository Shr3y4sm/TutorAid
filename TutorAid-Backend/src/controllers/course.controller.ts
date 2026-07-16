import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getCourses(
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
          course:courses(
            id,
            course_name,
            description,
            course_code,
            semester,
            section
          )
        `)
        .eq("student_id", studentId);

    if (error) throw error;

    const courses = (data ?? [])
      .map((row: any) => row.course)
      .filter(Boolean);

    res.json({
      success: true,
      data: courses,
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

export async function getCourse(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });

  } catch (err: any) {
    res.status(404).json({
      success: false,
      message:
        err.message ??
        "Course not found",
    });
  }
}