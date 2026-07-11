import { Router } from "express";

import {
    getTeacherAttendance,
    markAttendance,
} from "../controllers/teacherAttendance.controller";

const router = Router();

router.get("/", getTeacherAttendance);

router.post("/mark", markAttendance);

export default router;