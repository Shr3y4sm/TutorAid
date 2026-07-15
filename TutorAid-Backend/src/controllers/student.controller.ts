import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getDashboard(
  req: Request,
  res: Response
) {
  try {
    const studentId = req.query.studentId as string;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required",
      });
    }

    // Student
    const { data: student, error: studentError } =
      await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

    if (studentError) {
      return res.status(500).json({
        success: false,
        message: studentError.message,
      });
    }

    // Attendance
    const { data: attendance } =
      await supabase
        .from("attendance")
        .select("present")
        .eq("student_id", studentId);

    const total = attendance?.length ?? 0;

    const present =
      attendance?.filter((a) => a.present).length ?? 0;

    const attendancePercentage =
      total === 0
        ? 0
        : Math.round((present / total) * 100);

    // Today's classes
    const { data: classes } =
      await supabase
        .from("schedule")
        .select("*")
        .eq("teacher_id", student.teacher_id)
        .order("start_time", {
  ascending: true,
});

    // Announcements
    const { data: announcements } =
      await supabase
        .from("announcements")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    return res.json({
      success: true,
      data: {
        student,
        attendance: attendancePercentage,
        todaysClasses: classes ?? [],
        announcements: announcements ?? [],
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export async function getProfile(
  req: Request,
  res: Response
) {
  try {
    const studentId = req.query.studentId as string;

    const { data, error } =
      await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

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