import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getAttendance(
  req: Request,
  res: Response
) {
  try {
    const studentId = req.query.studentId as string;

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("student_id", studentId);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const total = data.length;

    const attended = data.filter(
      (x) => x.present
    ).length;

    const missed = total - attended;

    const overall =
      total === 0
        ? 0
        : Math.round((attended / total) * 100);

    res.json({
      success: true,
      data: {
        overallPercentage: overall,
        attendedClasses: attended,
        missedClasses: missed,
        subjects: [],
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}