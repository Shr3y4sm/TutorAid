import { Request, Response } from "express";
import { teacherAssignments } from "../data/teacherAssignment.data";

export function getTeacherAssignments(
  _req: Request,
  res: Response
) {
  res.json({
    success: true,
    data: teacherAssignments,
  });
}