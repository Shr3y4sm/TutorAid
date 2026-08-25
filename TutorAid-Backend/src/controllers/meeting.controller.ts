import { Request, Response } from "express";
import supabase from "../config/supabase";

/** Generate a unique meet code like "TA-AB12CD". */
function generateMeetCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `TA-${suffix}`;
}

/**
 * POST /meetings/start
 * Body: { teacher_id, schedule_id?, subject? }
 * Creates a live meeting session and returns its meet_code.
 */
export async function startMeeting(req: Request, res: Response) {
  try {
    const { teacher_id, schedule_id, subject } = req.body;

    if (!teacher_id) {
      return res.status(400).json({
        success: false,
        message: "teacher_id is required.",
      });
    }

    // Optionally find the subject from the schedule if not provided
    let meetingSubject = subject ?? "Live Class";
    if (!subject && schedule_id) {
      const { data: schedule } = await supabase
        .from("schedule")
        .select("subject")
        .eq("id", schedule_id)
        .maybeSingle();
      if (schedule?.subject) meetingSubject = schedule.subject;
    }

    // Generate a unique meet code
    let meetCode = generateMeetCode();
    let tries = 0;
    while (tries < 5) {
      const { data: existing } = await supabase
        .from("meeting_sessions")
        .select("id")
        .eq("meet_code", meetCode)
        .maybeSingle();
      if (!existing) break;
      meetCode = generateMeetCode();
      tries++;
    }

    const { data, error } = await supabase
      .from("meeting_sessions")
      .insert({
        teacher_id,
        schedule_id: schedule_id ?? null,
        subject: meetingSubject,
        meet_code: meetCode,
        status: "live",
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * POST /meetings/join
 * Body: { meet_code, student_id }
 * Records that a student joined a live meeting.
 */
export async function joinMeeting(req: Request, res: Response) {
  try {
    const { meet_code, student_id } = req.body;

    if (!meet_code || !student_id) {
      return res.status(400).json({
        success: false,
        message: "meet_code and student_id are required.",
      });
    }

    const { data: session, error: sessionError } = await supabase
      .from("meeting_sessions")
      .select("*")
      .eq("meet_code", meet_code)
      .maybeSingle();

    if (sessionError) {
      return res.status(500).json({
        success: false,
        message: sessionError.message,
      });
    }

    if (!session || session.status !== "live") {
      return res.status(404).json({
        success: false,
        message: "Meeting not found or has ended.",
      });
    }

    // Upsert the participant (idempotent — if already joined, just refresh joined_at)
    const { data, error } = await supabase
      .from("meeting_participants")
      .upsert(
        {
          session_id: session.id,
          student_id,
          joined_at: new Date().toISOString(),
        },
        { onConflict: "session_id,student_id" }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      data: {
        session_id: session.id,
        meet_code: session.meet_code,
        subject: session.subject,
        joined_at: data.joined_at,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * POST /meetings/end
 * Body: { meet_code, teacher_id }
 * Ends the meeting and auto-marks attendance as Present for everyone who joined.
 * (Option A — only joiners are marked. Non-joiners are left untouched.)
 */
export async function endMeeting(req: Request, res: Response) {
  try {
    const { meet_code, teacher_id } = req.body;

    if (!meet_code || !teacher_id) {
      return res.status(400).json({
        success: false,
        message: "meet_code and teacher_id are required.",
      });
    }

    const { data: session, error: sessionError } = await supabase
      .from("meeting_sessions")
      .select("*")
      .eq("meet_code", meet_code)
      .maybeSingle();

    if (sessionError) {
      return res.status(500).json({
        success: false,
        message: sessionError.message,
      });
    }

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    // 1. Mark the session as ended
    const now = new Date().toISOString();
    const { error: endError } = await supabase
      .from("meeting_sessions")
      .update({ status: "ended", ended_at: now })
      .eq("id", session.id);

    if (endError) {
      return res.status(500).json({
        success: false,
        message: endError.message,
      });
    }

    // 2. Fetch all participants for this session
    const { data: participants, error: participantsError } = await supabase
      .from("meeting_participants")
      .select("student_id")
      .eq("session_id", session.id);

    if (participantsError) {
      return res.status(500).json({
        success: false,
        message: participantsError.message,
      });
    }

    // 3. Auto-mark attendance as "Present" for each participant ONLY.
    // Option A — students who did NOT join the meeting are left completely
    // untouched (no "Absent" row is ever created for them). This avoids
    // falsely marking absent students who weren't supposed to attend.
    const attendanceDate = now.slice(0, 10); // YYYY-MM-DD
    let markedCount = 0;

    if (participants && participants.length > 0) {
      // Use upsert so re-running doesn't create duplicate rows.
      // Columns (present, class_date, marked_by, student_id) match the
      // existing "attendance" table schema used across the app.
      const { error: attendanceError } = await supabase
        .from("attendance")
        .upsert(
          participants.map((p: any) => ({
            student_id: p.student_id,
            marked_by: teacher_id,
            class_date: attendanceDate,
            present: true,
          })),
          { onConflict: "student_id,class_date" }
        );

      if (attendanceError) {
        return res.status(500).json({
          success: false,
          message: attendanceError.message,
        });
      }
      markedCount = participants.length;
    }

    return res.json({
      success: true,
      data: {
        ended_at: now,
        attendance_marked: markedCount,
        meet_code: session.meet_code,
        subject: session.subject,
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * GET /meetings/:code
 * Fetch meeting details by code.
 */
export async function getMeeting(req: Request, res: Response) {
  try {
    const { code } = req.params;

    const { data, error } = await supabase
      .from("meeting_sessions")
      .select("*")
      .eq("meet_code", code)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * GET /meetings/:code/participants
 * List all students who joined a meeting.
 */
export async function getParticipants(req: Request, res: Response) {
  try {
    const { code } = req.params;

    const { data: session } = await supabase
      .from("meeting_sessions")
      .select("id")
      .eq("meet_code", code)
      .maybeSingle();

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found.",
      });
    }

    const { data, error } = await supabase
      .from("meeting_participants")
      .select(`
        student_id,
        joined_at,
        left_at,
        students(id, full_name, usn)
      `)
      .eq("session_id", session.id)
      .order("joined_at");

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * GET /meetings/teacher/:teacherId
 * All meetings for a teacher (for attendance history).
 */
export async function getTeacherMeetings(req: Request, res: Response) {
  try {
    const { teacherId } = req.params;

    const { data, error } = await supabase
      .from("meeting_sessions")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("started_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // Attach participant counts
    const withCounts = await Promise.all(
      (data ?? []).map(async (session: any) => {
        const { count } = await supabase
          .from("meeting_participants")
          .select("*", { count: "exact", head: true })
          .eq("session_id", session.id);
        return { ...session, participants_count: count ?? 0 };
      })
    );

    return res.json({
      success: true,
      data: withCounts,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * GET /meetings/student/:studentId
 * Live meetings for a student's teacher(s) — used for "Live Now" badge.
 */
export async function getStudentLiveMeetings(req: Request, res: Response) {
  try {
    const { studentId } = req.params;

    // Find the teacher(s) this student is linked to
    const { data: links } = await supabase
      .from("teacher_students")
      .select("teacher_id")
      .eq("student_id", studentId);

    const teacherIds = (links ?? []).map((l: any) => l.teacher_id);

    if (teacherIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const { data, error } = await supabase
      .from("meeting_sessions")
      .select("*")
      .in("teacher_id", teacherIds)
      .eq("status", "live")
      .order("started_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      data: data ?? [],
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}