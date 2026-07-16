import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getDashboard(
  req: Request,
  res: Response
) {
  try {
    const studentId =
      req.query.studentId as string;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "studentId is required",
      });
    }

    const { data: student, error: studentError } =
      await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

    if (studentError) throw studentError;

    const { data: attendance } =
      await supabase
        .from("attendance")
        .select("present")
        .eq("student_id", studentId);

    const total =
      attendance?.length ?? 0;

    const present =
      attendance?.filter(
        (a: any) => a.present
      ).length ?? 0;

    const attendancePercentage =
      total === 0
        ? 0
        : Math.round(
            (present / total) * 100
          );

    const { data: teacherLink } =
      await supabase
        .from("teacher_students")
        .select("teacher_id")
        .eq("student_id", studentId)
        .maybeSingle();

    let todaysClasses: any[] = [];

    if (teacherLink?.teacher_id) {
      const { data: classes } =
        await supabase
          .from("schedule")
          .select("*")
          .eq(
            "teacher_id",
            teacherLink.teacher_id
          )
          .order("start_time");

      todaysClasses = classes ?? [];
    }

    const { data: announcements } =
      await supabase
        .from("announcements")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    res.json({
      success: true,
      data: {
        student,
        attendance:
          attendancePercentage,
        todaysClasses,
        announcements:
          announcements ?? [],
      },
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message:
        err.message ??
        "Internal Server Error",
    });
  }
}

export async function getProfile(
  req: Request,
  res: Response
) {
  try {
    const studentId =
      req.query.studentId as string;

    const { data, error } =
      await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message:
        err.message ??
        "Internal Server Error",
    });
  }
}

export async function getStudentSchedule(
  req: Request,
  res: Response
) {
  try {
    const studentId =
      req.query.studentId as string;

    const { data: teacherLink, error: linkError } =
      await supabase
        .from("teacher_students")
        .select("teacher_id")
        .eq("student_id", studentId)
        .maybeSingle();

    if (linkError) throw linkError;

    if (!teacherLink) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const { data, error } =
      await supabase
        .from("schedule")
        .select(`
          *,
          teachers(
            full_name
          )
        `)
        .eq(
          "teacher_id",
          teacherLink.teacher_id
        )
        .order("day")
        .order("start_time");

    if (error) throw error;

    res.json({
      success: true,
      data: data ?? [],
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