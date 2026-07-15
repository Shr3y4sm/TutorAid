import { Router } from "express";

import {
    registerStudent,
  registerTeacher,
  searchTeacher,
  getUserRole
} from "../controllers/auth.controller";

const router = Router();

router.post("/teacher", registerTeacher);
router.post("/student", registerStudent);
router.get(
  "/teacher/:code",
  searchTeacher
);
router.get("/role", getUserRole);

export default router;