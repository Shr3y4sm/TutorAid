import { Router } from "express";

import {
  generateToken,
} from "../controllers/stream.controller";

const router = Router();

router.post(
  "/token",
  generateToken
);

export default router;