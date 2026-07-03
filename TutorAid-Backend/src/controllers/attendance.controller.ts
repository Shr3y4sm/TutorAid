import { Request, Response } from "express";
import { attendanceData } from "../data/attendance.data";

export function getAttendance(
  _req: Request,
  res: Response
) {
  res.status(200).json({
    success: true,
    data: attendanceData,
  });
}