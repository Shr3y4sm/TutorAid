import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getTeacherSchedule(
  req: Request,
  res: Response
) {
  try {
    const teacherId = req.query.teacherId as string;

    const { data, error } = await supabase
      .from("schedule")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("start_time", {
        ascending: true,
      });

    if (error) {
      return res.status(500).json({
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