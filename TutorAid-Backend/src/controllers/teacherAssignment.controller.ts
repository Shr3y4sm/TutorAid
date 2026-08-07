import { Request, Response } from "express";
import { randomUUID } from "crypto";
import supabase from "../config/supabase";
import { AssignmentService } from "../services/assignment.service";

/** Safely extract a string route param (handles arrays). */
function routeParam(req: Request, key: string): string {
  const value = req.params[key];
  return typeof value === "string" ? value : "";
}
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

    const assignment =
      await AssignmentService
        .createAssignment(req.body);

    return res.status(201).json({
      success: true,
      data: assignment,
    });

  } catch (err: any) {

    return res.status(500).json({
      success: false,
      message: err.message,
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

    const assignment =
      await AssignmentService
        .updateAssignment(
          routeParam(req, "id"),
          req.body
        );

    return res.json({
      success: true,
      data: assignment,
    });

  } catch (err: any) {

    return res.status(500).json({
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

    await AssignmentService
      .deleteAssignment(routeParam(req, "id"));

    return res.json({
      success: true,
    });

  } catch (err: any) {

    return res.status(500).json({
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

    const data =
      await AssignmentService
        .getAssignmentStudents(
          routeParam(req, "id")
        );

    return res.json({
      success: true,
      data,
    });

  } catch (err: any) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

}
export async function getAssignmentSubmissions(
  req: Request,
  res: Response
) {
  try {
    const data =
      await AssignmentService
        .getAssignmentSubmissions(
          routeParam(req, "id")
        );

    return res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


export async function uploadAssignmentFileBase64(
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
      `${Date.now()}-${Math.random()
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
