import { api } from "./client";

import { ApiResponse } from "@/types/api";

export async function gradeSubmission(
    submissionId: string,
    marks: number,
    feedback: string
) {

    return api<ApiResponse<any>>(
        `/teacher/assignments/submission/${submissionId}/grade`,
        {

            method: "PATCH",

            body: {
                marks,
                feedback
            }

        }
    );

}