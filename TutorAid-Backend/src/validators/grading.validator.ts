import { z } from "zod";

export const gradeSubmissionSchema =
z.object({

    marks: z
        .number()
        .min(0)
        .max(100),

    feedback: z
        .string()
        .max(1000)

});