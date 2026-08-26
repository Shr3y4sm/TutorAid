import { Request, Response } from "express";

import { AttendanceService } from "../services/attendance.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/** Safely extract a string route param (handles arrays). */
function routeParam(req: Request, key: string): string {
  const value = req.params[key];
  return typeof value === "string" ? value : "";
}

export const markAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      studentId,
      teacherId,
      classDate,
      present,
    } = req.body;

    const attendance =
      await AttendanceService.markAttendance(
        studentId,
        teacherId,
        classDate,
        present
      );

    return ApiResponse.created(
      res,
      attendance,
      "Attendance marked."
    );
  }
);

export const getAttendanceByDate = asyncHandler(
  async (req: Request, res: Response) => {
    const attendanceDate =
      req.query.date as string;

    const attendance =
      await AttendanceService.getAttendanceByDate(
        attendanceDate
      );

    return ApiResponse.success(
      res,
      attendance
    );
  }
);

export const getStudentAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const attendance =
      await AttendanceService.getStudentAttendance(
        routeParam(req, "id")
      );

    return ApiResponse.success(
      res,
      attendance
    );
  }
);

export const updateAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const attendance =
      await AttendanceService.updateAttendance(
        routeParam(req, "id"),
        req.body.present
      );

    return ApiResponse.success(
      res,
      attendance,
      "Attendance updated."
    );
  }
);

export const deleteAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    await AttendanceService.deleteAttendance(
      routeParam(req, "id")
    );

    return ApiResponse.noContent(res);
  }
);

export const getAttendanceSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const summary =
      await AttendanceService.getAttendanceSummary(
        routeParam(req, "id")
      );

    return ApiResponse.success(
      res,
      summary
    );
  }
);