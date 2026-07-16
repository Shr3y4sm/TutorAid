import { Router } from "express";

import {
  getTeacherSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/teacherSchedule.controller";

const router = Router();

router.get("/", getTeacherSchedule);

router.post("/", createSchedule);

router.put("/:id", updateSchedule);

router.delete("/:id", deleteSchedule);

export default router;