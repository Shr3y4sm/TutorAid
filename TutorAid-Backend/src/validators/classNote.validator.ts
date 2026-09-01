import { z } from "zod";

export const createClassNoteSchema = z.object({
  teacher_id: z.string().uuid(),

  meet_code: z.string().min(3).max(20),

  body: z.string().min(1).max(2000),

  student_id: z.string().uuid().optional().nullable(),
});