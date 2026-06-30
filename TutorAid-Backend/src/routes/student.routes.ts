import { Router } from "express";
import { getDashboard } from "../controllers/student.controller";

const router = Router();

router.get("/dashboard", getDashboard);

export default router;