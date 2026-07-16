import { Router } from "express";

import {
  getTeacherAttendance,
  markAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/teacherAttendance.controller";

const router = Router();

router.get("/", getTeacherAttendance);

router.post("/", markAttendance);

router.put("/:id", updateAttendance);

router.delete("/:id", deleteAttendance);

export default router;