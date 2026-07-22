import { Request, Response } from "express";

import { AttendanceService } from "../services/attendance.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const markAttendance = asyncHandler(
  async (req: Request, res: Response) => {

    const {
      studentId,
      teacherId,
      attendanceDate,
      status,
      remarks,
    } = req.body;

    const attendance =
      await AttendanceService.markAttendance(
        studentId,
        teacherId,
        attendanceDate,
        status,
        remarks
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
        req.params.id
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
        req.params.id,
        req.body.status,
        req.body.remarks
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
      req.params.id
    );

    return ApiResponse.noContent(res);
  }
);

export const getAttendanceSummary = asyncHandler(
  async (req: Request, res: Response) => {

    const summary =
      await AttendanceService.getAttendanceSummary(
        req.params.id
      );

    return ApiResponse.success(
      res,
      summary
    );
  }
);