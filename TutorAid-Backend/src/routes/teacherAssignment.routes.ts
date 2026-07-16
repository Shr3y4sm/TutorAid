import { Router } from "express";

import {
  getTeacherAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/teacherAssignment.controller";

const router = Router();

router.get("/", getTeacherAssignments);

router.post("/", createAssignment);

router.put("/:id", updateAssignment);

router.delete("/:id", deleteAssignment);

export default router;