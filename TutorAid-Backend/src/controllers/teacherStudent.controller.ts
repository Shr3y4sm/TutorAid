import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getTeacherStudents(
  req: Request,
  res: Response
) {
  try {
    const teacherId =
      req.query.teacherId as string;

    const { data, error } =
      await supabase
        .from("students")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("full_name");

    if (error) throw error;

    res.status(200).json({
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