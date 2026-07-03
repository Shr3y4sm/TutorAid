import { Router } from "express";
import { getAttendance } from "../controllers/attendance.controller";

const router = Router();

router.get("/", getAttendance);

export default router;