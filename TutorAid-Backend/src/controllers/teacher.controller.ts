import { Request, Response } from "express";
import { teacherDashboard } from "../data/teacher.data";

export function getTeacherDashboard(
  _req: Request,
  res: Response
) {
  res.json({
    success: true,
    data: teacherDashboard,
  });
}