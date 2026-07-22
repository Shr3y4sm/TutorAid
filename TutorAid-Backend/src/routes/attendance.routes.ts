import { Router } from "express";

import {
  markAttendance,
  getAttendanceByDate,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary,
} from "../controllers/attendance.controller";

import { validate } from "../middleware/validate.middleware";

import {
  markAttendanceSchema,
  updateAttendanceSchema,
} from "../validators/attendance.validator";

const router = Router();

router.post(
  "/",
  validate(markAttendanceSchema),
  markAttendance
);

router.get(
  "/",
  getAttendanceByDate
);

router.get(
  "/student/:id",
  getStudentAttendance
);

router.get(
  "/summary/:id",
  getAttendanceSummary
);

router.patch(
  "/:id",
  validate(updateAttendanceSchema),
  updateAttendance
);

router.delete(
  "/:id",
  deleteAttendance
);

export default router;