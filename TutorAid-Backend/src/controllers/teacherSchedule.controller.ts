import { Request, Response } from "express";
import { teacherSchedule } from "../data/teacherSchedule.data";

export function getTeacherSchedule(
  _req: Request,
  res: Response
) {
  res.json({
    success: true,
    data: teacherSchedule,
  });
}