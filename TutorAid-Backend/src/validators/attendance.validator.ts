import { z } from "zod";

export const markAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  teacherId: z.string().uuid(),
  attendanceDate: z.string(),
  status: z.enum([
    "Present",
    "Absent",
    "Late",
    "Leave",
  ]),
  remarks: z.string().optional(),
});

export const updateAttendanceSchema = z.object({
  status: z.enum([
    "Present",
    "Absent",
    "Late",
    "Leave",
  ]),
  remarks: z.string().optional(),
});