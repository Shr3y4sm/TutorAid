import { Router } from "express";
import { getTeacherAssignments } from "../controllers/teacherAssignment.controller";

const router = Router();

router.get("/", getTeacherAssignments);

export default router;