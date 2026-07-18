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


export async function getStudentAssignments(
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

    const { data, error } = await supabase
      .from("assignment_students")
      .select(`
        id,
        status,
        marks,
        feedback,
        submitted_at,
        assignment:assignments(
          id,
          teacher_id,
          title,
          description,
          subject,
          due_date,
          max_marks,
          status,
          file_url,
          created_at
        )
      `)
      .eq("student_id", studentId)
      .order("created_at", {
        foreignTable: "assignments",
        ascending: false,
      });

    if (error) throw error;

    res.json({
      success: true,
      data: data ?? [],
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: [],
    });
  }
}


export async function getStudentAssignment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("assignments")
      .select(`
        *,
        teachers(
          full_name
        )
      `)
      .eq("id", id)
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
        "Unable to load assignment.",
    });
  }
}

export async function submitAssignment(
    req: Request,
    res: Response
) {
    try {

        const { id } = req.params;

        const {
            student_id,
            file_url,
            remarks
        } = req.body;

        const { error: submitError } =
            await supabase
                .from("assignment_submissions")
                .upsert({
                    assignment_id: id,
                    student_id,
                    file_url,
                    remarks
                });

        if (submitError) throw submitError;

        const { error: statusError } =
            await supabase
                .from("assignment_students")
                .update({
                    status: "Submitted",
                    submitted_at: new Date()
                })
                .eq("assignment_id", id)
                .eq("student_id", student_id);

        if (statusError) throw statusError;

        res.json({
            success: true
        });

    } catch (err: any) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
}