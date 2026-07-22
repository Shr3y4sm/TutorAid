import { z } from "zod";

export const uploadResourceSchema = z.object({
  teacher_id: z.string().uuid(),

  title: z.string().min(3),

  description: z.string().optional(),

  subject: z.string().min(2),

  category: z.string().min(2),
});

export const updateResourceSchema =
  uploadResourceSchema
    .omit({
      teacher_id: true,
    })
    .partial();