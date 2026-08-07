import { Request, Response } from "express";

import { ApiResponse } from "../utils/ApiResponse";

import { asyncHandler } from "../utils/asyncHandler";

import { GradingService } from "../services/grading.service";

/** Safely extract a string route param (handles arrays). */
function routeParam(req: Request, key: string): string {
  const value = req.params[key];
  return typeof value === "string" ? value : "";
}

export const gradeSubmission =
asyncHandler(async (

    req: Request,
    res: Response

) => {

    const id = routeParam(req, "id");

    const {
        marks,
        feedback
    } = req.body;

    const submission =
        await GradingService.gradeSubmission(
            id,
            marks,
            feedback
        );

    return ApiResponse.success(
        res,
        submission,
        "Assignment graded."
    );

});