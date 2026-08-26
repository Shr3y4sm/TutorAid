import { z } from "zod";

export const markAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  teacherId: z.string().uuid(),

  /** YYYY-MM-DD */
  classDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),

  present: z.boolean(),
});

export const updateAttendanceSchema = z.object({
  present: z.boolean(),
});