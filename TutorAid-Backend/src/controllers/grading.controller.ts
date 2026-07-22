import { Request, Response } from "express";

import { ApiResponse } from "../utils/ApiResponse";

import { asyncHandler } from "../utils/asyncHandler";

import { GradingService } from "../services/grading.service";

export const gradeSubmission =
asyncHandler(async (

    req: Request,
    res: Response

) => {

    const { id } = req.params;

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