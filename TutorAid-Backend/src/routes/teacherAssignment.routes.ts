import { Router } from "express";

import {
  getTeacherAssignments,
  createAssignment,
} from "../controllers/teacherAssignment.controller";

const router = Router();

router.get("/", getTeacherAssignments);

router.post("/", createAssignment);

export default router;