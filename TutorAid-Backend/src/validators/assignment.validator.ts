import { z } from "zod";

export const createAssignmentSchema = z.object({
  teacher_id: z.string().uuid(),

  title: z.string().min(3).max(100),

  description: z.string().min(3),

  subject: z.string().min(2),

  due_date: z.string(),

  max_marks: z.number().int().positive(),

  students: z.array(z.string().uuid()),

  file_url: z.string().optional().default(""),
});

export const updateAssignmentSchema = createAssignmentSchema.partial().omit({
  teacher_id: true,
  students: true,
});