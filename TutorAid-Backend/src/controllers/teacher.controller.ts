import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getTeacherDashboard(
  req: Request,
  res: Response
) {
  try {
    const teacherId = req.query.teacherId as string;

    const { data: teacher, error: teacherError } =
      await supabase
        .from("teachers")
        .select("*")
        .eq("id", teacherId)
        .single();

    if (teacherError) throw teacherError;

    const { count: totalStudents } =
      await supabase
        .from("teacher_students")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("teacher_id", teacherId);

    const { count: totalAssignments } =
      await supabase
        .from("assignments")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("teacher_id", teacherId);

    const { data: classes } =
      await supabase
        .from("schedule")
        .select("*")
        .eq("teacher_id", teacherId)
        .order("start_time");

    const { data: attendance } =
      await supabase
        .from("attendance")
        .select("present, marked_by")
        .eq("marked_by", teacherId);

    const present =
      attendance?.filter(a => a.present).length ?? 0;

    const attendanceToday =
      attendance && attendance.length > 0
        ? Math.round(
            (present / attendance.length) * 100
          )
        : 0;

    res.json({
      success: true,
      data: {
        teacher: {
          name: teacher.full_name,
          subject: teacher.subjects,
          teacherCode: teacher.teacher_code,
        },

        stats: {
          todayClasses: classes?.length ?? 0,
          totalStudents: totalStudents ?? 0,
          pendingAssignments:
            totalAssignments ?? 0,
          attendanceToday,
        },

        quickActions: [
          {
            id: 1,
            title: "Students",
            icon: "people",
          },
          {
            id: 2,
            title: "Assignments",
            icon: "document-text",
          },
          {
            id: 3,
            title: "Attendance",
            icon: "checkmark-circle",
          },
          {
            id: 4,
            title: "Schedule",
            icon: "calendar",
          },
          {
            id: 5,
            title: "AI Assistant",
            icon: "sparkles",
          },
        ],

        todayClasses:
          (classes ?? []).map((c: any) => ({
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
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}