import { Router } from "express";

import {
  getDashboard,
  getProfile,
  getStudentSchedule,
  getStudentAssignments,
  getStudentAssignment,
  submitAssignment,
  uploadStudentFile,
  uploadStudentFileBase64,
} from "../controllers/student.controller";

import upload from "../middleware/upload";

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

router.post(
  "/assignments/upload",
  upload.single("file"),
  uploadStudentFile
);

router.post(
  "/assignments/upload-base64",
  uploadStudentFileBase64
);
export default router;