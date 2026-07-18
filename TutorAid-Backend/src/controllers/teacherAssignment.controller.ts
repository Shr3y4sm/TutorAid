import { Request, Response } from "express";
import { randomUUID } from "crypto";
import supabase from "../config/supabase";

export async function getTeacherAssignments(
  req: Request,
  res: Response
) {
  try {
    const teacherId = req.query.teacherId as string;

    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("teacher_id", teacherId)
      .order("created_at", {
        ascending: false,
      });

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

export async function createAssignment(
  req: Request,
  res: Response
) {
  try {
    const {
      teacher_id,
      title,
      description,
      subject,
      due_date,
      max_marks,
      students,
      file_url,
    } = req.body;

    const { data: assignment, error } =
      await supabase
        .from("assignments")
        .insert({
          teacher_id,
          title,
          description,
          subject,
          due_date,
          max_marks,
          file_url,
          status: "Active",
        })
        .select()
        .single();

    if (error) throw error;

    if (students?.length) {
      const assignmentLinks =
        students.map(
          (studentId: string) => ({
            assignment_id:
              assignment.id,
            student_id:
              studentId,
          })
        );

      const {
        error: assignmentError,
      } = await supabase
        .from(
          "assignment_students"
        )
        .insert(
          assignmentLinks
        );

      if (assignmentError)
        throw assignmentError;

      const notifications =
        students.map(
          (studentId: string) => ({
            student_id:
              studentId,
            teacher_id,
            title:
              "New Assignment",
            message: `${title} has been assigned.`,
            type: "assignment",
          })
        );

      const {
        error: notificationError,
      } = await supabase
        .from("notifications")
        .insert(
          notifications
        );

      if (notificationError)
        throw notificationError;
    }

    res.status(201).json({
      success: true,
      data: assignment,
    });

  } catch (err: any) {
    res.status(500).json({
      success: false,
      message:
        err.message ??
        "Unable to create assignment.",
    });
  }
}

export async function uploadAssignmentFile(
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
      `${randomUUID()}.${extension}`;

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


export async function updateAssignment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      subject,
      due_date,
      max_marks,
    } = req.body;

    const { data, error } = await supabase
      .from("assignments")
      .update({
        title,
        description,
        subject,
        due_date,
        max_marks,
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


export async function deleteAssignment(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    await supabase
      .from("assignment_students")
      .delete()
      .eq("assignment_id", id);

    const { error } = await supabase
      .from("assignments")
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
export async function getAssignmentStudents(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("assignment_students")
        .select(`
          id,
          status,
          marks,
          feedback,
          submitted_at,
          student:students(
            id,
            full_name,
            class,
            roll_no
          )
        `)
        .eq("assignment_id", id);

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