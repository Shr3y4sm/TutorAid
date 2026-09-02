import { Router } from "express";

import {
  getStudentReport,
  getStudentPeriodSummary,
} from "../controllers/report.controller";

const router = Router();

// GET /reports/student/:id — performance report for one student
router.get("/student/:id", getStudentReport);

// GET /reports/student/:id/summary?range=week|month
router.get("/student/:id/summary", getStudentPeriodSummary);

export default router;
