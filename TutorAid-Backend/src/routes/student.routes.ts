import { Router } from "express";
import {
  getDashboard,
  getProfile,
  getStudentSchedule,
} from "../controllers/student.controller";

const router = Router();

router.get("/dashboard", getDashboard);

router.get("/profile", getProfile);

router.get(
  "/schedule",
  getStudentSchedule
);

export default router;