import { Router } from "express";

import { getStudentReport } from "../controllers/report.controller";

const router = Router();

// GET /reports/student/:id — performance report for one student
router.get("/student/:id", getStudentReport);

export default router;
