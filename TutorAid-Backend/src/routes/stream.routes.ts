import { Router } from "express";

import {
  generateToken,
  createInstantCall,
  activeCall,
  finishCall,
} from "../controllers/stream.controller";

const router = Router();

router.post("/token", generateToken);

router.post("/create-call", createInstantCall);

router.get("/active-call", activeCall);

router.post("/end-call", finishCall);

export default router;