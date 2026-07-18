import { Router } from "express";

import {
  getDashboard,
  getProfile,
  getStudentSchedule,
  getStudentAssignments,
  getStudentAssignment,
  submitAssignment,
} from "../controllers/student.controller";

const router = Router();

router.get("/dashboard", getDashboard);

router.get("/profile", getProfile);

router.get("/schedule", getStudentSchedule);

router.get("/assignments", getStudentAssignments);

router.get("/assignments/:id", getStudentAssignment);
router.post(
    "/assignments/:id/submit",
    submitAssignment
);
export default router;