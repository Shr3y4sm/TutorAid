import { Request, Response } from "express";
import supabase from "../config/supabase";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: "teacher" | "student" | "admin";
  };
}

/**
 * Map Supabase error codes to HTTP status codes so the client
 * can differentiate between "not found" and "server error".
 */
function statusCodeFor(err: any): number {
  if (!err) return 500;

  const pgCode: string | undefined =
    err.code ?? err?.details?.code;

  switch (pgCode) {
    // ── NOT FOUND ─────────────────────────────────────────
    case "PGRST116": // .single() returned no rows
      return 404;

    // ── UNIQUE VIOLATION ──────────────────────────────────
    case "23505":
    case "PGRST204":
      return 409;

    // ── RLS / PERMISSION ──────────────────────────────────
    case "42501":
    case "PGRST301":
      return 403;

    // ── INVALID INPUT / CHECK VIOLATION ───────────────────
    case "22P02":
    case "23514":
      return 400;

    // ── EVERYTHING ELSE ───────────────────────────────────
    default:
      return 500;
  }
}

export async function getTeacherDashboard(
  req: AuthRequest,
  res: Response
) {
  try {
    // ── Auth guard ────────────────────────────────────────
    // req.user is set by the authenticate middleware.
    // If it is somehow missing, respond with 401 explicitly
    // instead of a generic 500 TypeError.
    // --------------------------------------------------------
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const authUserId = req.user.id;

    // ── 1. Teacher lookup ─────────────────────────────────
    const { data: teacher, error: teacherError } =
      await supabase
        .from("teachers")
        .select("id, full_name, subjects, teacher_code")
        .eq("auth_user_id", authUserId)
        .maybeSingle();

    if (teacherError) {
      return res.status(statusCodeFor(teacherError)).json({
        success: false,
        message: teacherError.message,
      });
    }

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found.",
      });
    }

    const teacherId = teacher.id;

    // ── 2. Parallel independent queries ───────────────────
    // All four queries only depend on teacherId, which is now
    // available.  Running them in parallel reduces the total
    // latency from sum-of-queries to max-of-queries.
    // --------------------------------------------------------
    const [
      studentResult,
      assignmentResult,
      scheduleResult,
      attendanceResult,
    ] = await Promise.all([
      supabase
        .from("teacher_students")
        .select("*", { count: "exact", head: true })
        .eq("teacher_id", teacherId),

      supabase
        .from("assignments")
        .select("*", { count: "exact", head: true })
        .eq("teacher_id", teacherId),

      supabase
        .from("schedule")
        .select("id, subject, section, room, start_time, end_time")
        .eq("teacher_id", teacherId)
        .order("start_time"),

      supabase
        .from("attendance")
        .select("present, marked_by")
        .eq("marked_by", teacherId),
    ]);

    // ── 3. Error propagation for each query ───────────────
    // Previously these errors were silently ignored, causing
    // misleading zero / empty defaults to be returned.
    // --------------------------------------------------------
    if (studentResult.error) {
      return res.status(statusCodeFor(studentResult.error)).json({
        success: false,
        message: studentResult.error.message,
      });
    }

    if (assignmentResult.error) {
      return res.status(statusCodeFor(assignmentResult.error)).json({
        success: false,
        message: assignmentResult.error.message,
      });
    }

    if (scheduleResult.error) {
      return res.status(statusCodeFor(scheduleResult.error)).json({
        success: false,
        message: scheduleResult.error.message,
      });
    }

    if (attendanceResult.error) {
      return res.status(statusCodeFor(attendanceResult.error)).json({
        success: false,
        message: attendanceResult.error.message,
      });
    }

    // ── 4. Safe defaults ──────────────────────────────────
    const totalStudents = studentResult.count ?? 0;
    const totalAssignments = assignmentResult.count ?? 0;
    const classes = scheduleResult.data ?? [];
    const attendance = attendanceResult.data ?? [];

    // ── 5. Attendance calculation ─────────────────────────
    const present =
      attendance.filter((a) => a.present).length;

    const attendanceToday =
      attendance.length > 0
        ? Math.round((present / attendance.length) * 100)
        : 0;

    // ── 6. Response construction ──────────────────────────
    res.json({
      success: true,
      data: {
        teacher: {
          name: teacher.full_name ?? "Unknown",
          subject: teacher.subjects ?? "N/A",
          teacherCode: teacher.teacher_code ?? "N/A",
        },

        stats: {
          todayClasses: classes.length,
          totalStudents,
          pendingAssignments: totalAssignments,
          attendanceToday,
        },

        quickActions: [
          { id: 1, title: "Start Class", icon: "videocam" },
          { id: 2, title: "Students",    icon: "people" },
          { id: 3, title: "Assignments",  icon: "document-text" },
          { id: 4, title: "Attendance",   icon: "checkmark-circle" },
          { id: 5, title: "Schedule",     icon: "calendar" },
          { id: 6, title: "AI Assistant",  icon: "sparkles" },
          { id: 7, title: "Class History", icon: "time" },
        ],

        todayClasses: classes.map((c: any) => ({
          id: c.id,
          subject: c.subject,
          section: c.section,
          room: c.room,
          time: `${c.start_time} - ${c.end_time}`,
        })),

        recentActivity: [],
      },
    });

  } catch (err: any) {
    // ── Unexpected errors ─────────────────────────────────
    // Fallback 500 for things like JSON parse errors,
    // unexpected null pointers, or uncaught runtime errors.
    // --------------------------------------------------------
    console.error("[getTeacherDashboard] Unexpected error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}