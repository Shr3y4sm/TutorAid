import { Router } from "express";

import {
  getTeacherStudents,
} from "../controllers/teacherStudent.controller";

const router = Router();

router.get("/", getTeacherStudents);

export default router;