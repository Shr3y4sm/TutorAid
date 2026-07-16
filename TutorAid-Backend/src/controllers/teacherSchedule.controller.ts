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

    const { error } = await supabase
      .from("schedule")
      .delete()
      .eq("id", id);

    if (error) throw error;

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