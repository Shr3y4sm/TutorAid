import { Request, Response } from "express";
import supabase from "../config/supabase";

export async function getNotifications(
  req: Request,
  res: Response
) {
  try {
    const studentId =
      req.query.studentId as string;

    const { data, error } =
      await supabase
        .from("notifications")
        .select("*")
        .eq("student_id", studentId)
        .order("created_at", {
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

export async function markNotificationRead(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const { error } =
      await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
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