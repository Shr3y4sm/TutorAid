import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getCourses(
  req: Request,
  res: Response
) {
  try {
    const studentId = req.query.studentId as string;

    const { data, error } = await supabase
      .from("student_courses")
      .select(`
        course:courses (
          id,
          course_name,
          description,
          course_code,
          semester,
          section
        )
      `)
      .eq("student_id", studentId);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data.map((x: any) => x.course),
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getCourse(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}