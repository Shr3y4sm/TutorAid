import { Router } from "express";

import {
  getTeacherStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/teacherStudent.controller";

const router = Router();

router.get("/", getTeacherStudents);

router.post("/", createStudent);

router.get("/:id", getStudentById);

router.put("/:id", updateStudent);

router.delete("/:id", deleteStudent);
export default router;