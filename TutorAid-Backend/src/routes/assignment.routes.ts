import { Router } from "express";
import { getAssignments } from "../controllers/assignment.controller";

const router = Router();

router.get("/", getAssignments);

export default router;
