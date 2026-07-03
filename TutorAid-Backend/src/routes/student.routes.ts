import { Router } from "express";
import {
  getDashboard,
  getProfile,
} from "../controllers/student.controller";

const router = Router();

router.get("/dashboard", getDashboard);

router.get("/profile", getProfile);

export default router;
