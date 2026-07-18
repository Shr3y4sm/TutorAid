import { Router } from "express";

import upload from "../middleware/upload";

import {
  getTeacherAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  uploadAssignmentFile,
} from "../controllers/teacherAssignment.controller";

const router = Router();

router.get("/", getTeacherAssignments);

router.post(
  "/upload",
  upload.single("file"),
  uploadAssignmentFile
);

router.post("/", createAssignment);

router.put("/:id", updateAssignment);

router.delete("/:id", deleteAssignment);

export default router;