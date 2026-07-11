import { Router } from "express";
import { getTeacherSchedule } from "../controllers/teacherSchedule.controller";

const router = Router();

router.get("/", getTeacherSchedule);

export default router;