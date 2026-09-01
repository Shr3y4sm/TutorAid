import { Request, Response } from "express";
import supabase from "../config/supabase";

/**
 * POST /class-notes
 * Body: { teacher_id, meet_code, body, student_id? }
 * Create an in-class pointer note. Requires a teacher_id (the caller's id).
 */
export async function createClassNote(req: Request, res: Response) {
  try {
    const { teacher_id, meet_code, body, student_id } = req.body;

    const { data, error } = await supabase
      .from("class_notes")
      .insert({
        teacher_id,
        meet_code,
        body,
        student_id: student_id ?? null,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({ success: true, data });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * GET /class-notes/meeting/:meetCode
 * All notes written during one live class (meet_code).
 */
export async function getMeetingNotes(req: Request, res: Response) {
  try {
    const { meetCode } = req.params;

    const { data, error } = await supabase
      .from("class_notes")
      .select("id, teacher_id, student_id, meet_code, body, created_at")
      .eq("meet_code", meetCode)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({ success: true, data: data ?? [] });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * GET /class-notes/student/:studentId
 * All notes about one student across classes (per-student record).
 */
export async function getStudentNotes(req: Request, res: Response) {
  try {
    const { studentId } = req.params;

    const { data, error } = await supabase
      .from("class_notes")
      .select("id, teacher_id, meet_code, body, created_at")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({ success: true, data: data ?? [] });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}

/**
 * DELETE /class-notes/:id
 * Remove a note (only the owning teacher's notes are matched).
 */
export async function deleteClassNote(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("class_notes")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}