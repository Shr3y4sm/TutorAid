import { Router } from "express";
import { getTeacherDashboard } from "../controllers/teacher.controller";

const router = Router();

router.get("/dashboard", getTeacherDashboard);

export default router;