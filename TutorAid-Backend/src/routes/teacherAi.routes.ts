import { Router } from "express";
import { getAiTools } from "../controllers/teacherAi.controller";

const router = Router();

router.get("/", getAiTools);

export default router;