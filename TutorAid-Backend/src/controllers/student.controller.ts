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
      content,
    } = req.body;

    // Save submission
    // If content (text answer) is provided, store it in file_url
    // since the assignment_submissions table doesn't have a content column
    const submissionFileUrl = content
      ? content
      : file_url;

    const { error: submissionError } = await supabase
      .from("assignment_submissions")
      .upsert({
        assignment_id: id,
        student_id,
        file_url: submissionFileUrl,
        status: "Submitted",
      });

    if (submissionError) throw submissionError;

    // Update assignment status for teacher view
    const { error: assignmentError } = await supabase
      .from("assignment_students")
      .update({
        status: "Submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("assignment_id", id)
      .eq("student_id", student_id);

    if (assignmentError) throw assignmentError;

    res.json({
      success: true,
      message: "Assignment submitted successfully.",
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


export async function uploadStudentFile(
  req: Request,
  res: Response
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const extension =
      req.file.originalname.split(".").pop();

    const filename =
      `student-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;

    const { error } =
      await supabase.storage
        .from("assignment-files")
        .upload(
          filename,
          req.file.buffer,
          {
            contentType:
              req.file.mimetype,
            upsert: false,
          }
        );

    if (error) throw error;

    const { data } =
      supabase.storage
        .from("assignment-files")
        .getPublicUrl(filename);

    return res.json({
      success: true,
      file_url: data.publicUrl,
    });

  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        err.message ??
        "Upload failed.",
    });
  }
}


export async function uploadStudentFileBase64(
  req: Request,
  res: Response
) {
  try {
    const {
      base64,
      filename,
      mimeType,
    } = req.body;

    if (!base64 || !filename) {
      return res.status(400).json({
        success: false,
        message: "Missing file data.",
      });
    }

    const extension =
      filename.split(".").pop() ?? "bin";

    const uploadFilename =
      `student-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${extension}`;

    // Convert base64 to Buffer
    const buffer = Buffer.from(
      base64,
      "base64"
    );

    const { error } =
      await supabase.storage
        .from("assignment-files")
        .upload(
          uploadFilename,
          buffer,
          {
            contentType:
              mimeType ??
              "application/octet-stream",
            upsert: false,
          }
        );

    if (error) throw error;

    const { data } =
      supabase.storage
        .from("assignment-files")
        .getPublicUrl(uploadFilename);

    return res.json({
      success: true,
      file_url: data.publicUrl,
    });

  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        err.message ??
        "Upload failed.",
    });
  }
}
