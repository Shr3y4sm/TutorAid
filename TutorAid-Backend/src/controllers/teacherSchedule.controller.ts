import { Request, Response } from "express";
import supabase from "../config/supabase";
import {
  getTeacherStudentIds,
  notifyStudents,
} from "../utils/notify";

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

export async function createSchedule(
  req: Request,
  res: Response
) {
  try {
    const {
      teacher_id,
      subject,
      section,
      room,
      start_time,
      end_time,
      day,
    } = req.body;

    const { data, error } = await supabase
  .from("schedule")
  .insert({
    teacher_id,
    subject,
    section,
    room,
    start_time,
    end_time,
    day,
  })
  .select()
  .single();

if (error) throw error;

// INSERT THE NOTIFICATION CODE HERE

const { data: students } =
  await supabase
    .from("teacher_students")
    .select("student_id")
    .eq("teacher_id", teacher_id);

if (students?.length) {
  const notifications = students.map(
    (student: any) => ({
      student_id: student.student_id,
      teacher_id,
      title: "New Class Scheduled",
      message: `${subject} has been scheduled on ${day} at ${start_time}.`,
      type: "schedule",
    })
  );

  await supabase
    .from("notifications")
    .insert(notifications);
}

res.status(201).json({
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


export async function updateSchedule(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      subject,
      section,
      room,
      start_time,
      end_time,
      day,
    } = req.body;

    const { data, error } = await supabase
      .from("schedule")
      .update({
        subject,
        section,
        room,
        start_time,
        end_time,
        day,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json({
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

export async function deleteSchedule(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    // Fetch the schedule first so we can (a) 404 cleanly when it
    // doesn't exist, and (b) notify the teacher's students with the
    // class details after a successful delete.
    const { data: schedule, error: fetchError } = await supabase
      .from("schedule")
      .select("teacher_id, subject, day, start_time, end_time")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found.",
      });
    }

    const { error } = await supabase
      .from("schedule")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Fire-and-forget: tell the teacher's students the class is cancelled.
    // A notification failure must never surface as a delete failure.
    try {
      const studentIds = await getTeacherStudentIds(
        schedule.teacher_id
      );

      await notifyStudents(studentIds, {
        teacher_id: schedule.teacher_id,
        title: "Class Cancelled",
        message:
          `${schedule.subject} on ${schedule.day} at ${schedule.start_time} has been cancelled.`,
        type: "schedule",
      });
    } catch (notifyErr) {
      console.warn(
        "cancellation notification failed:",
        notifyErr
      );
    }

    res.json({
      success: true,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}