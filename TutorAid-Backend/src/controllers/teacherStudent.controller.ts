import { Request, Response } from "express";
import { teacherStudents } from "../data/teacherStudent.data";

export function getTeacherStudents(
  _req: Request,
  res: Response
) {
  res.json({
    success: true,
    data: teacherStudents,
  });
}