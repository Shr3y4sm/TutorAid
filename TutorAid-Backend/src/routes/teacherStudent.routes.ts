import { Router } from "express";

import {
  getTeacherStudents,
  createStudent,
} from "../controllers/teacherStudent.controller";

const router = Router();

router.get("/", getTeacherStudents);

router.post("/", createStudent);

export default router;