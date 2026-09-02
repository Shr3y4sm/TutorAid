import { Request, Response } from "express";

import { ReportService, PeriodSummaryService } from "../services/report.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/** Safely extract a string route param (handles arrays). */
function routeParam(req: Request, key: string): string {
  const value = req.params[key];
  return typeof value === "string" ? value : "";
}

export const getStudentReport = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = routeParam(req, "id");
    const report = await ReportService.getStudentReport(studentId);
    return ApiResponse.success(res, report, "Student report generated.");
  }
);

export const getStudentPeriodSummary = asyncHandler(
  async (req: Request, res: Response) => {
    const studentId = routeParam(req, "id");
    const raw = req.query.range;
    const range = raw === "month" ? "month" : "week";
    const summary = await PeriodSummaryService.getStudentPeriodSummary(
      studentId,
      range
    );
    return ApiResponse.success(
      res,
      summary,
      "Period summary generated."
    );
  }
);
