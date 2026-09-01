import { Router } from "express";

import { validate } from "../middleware/validate.middleware";
import { createClassNoteSchema } from "../validators/classNote.validator";
import {
  createClassNote,
  getMeetingNotes,
  getStudentNotes,
  deleteClassNote,
} from "../controllers/classNote.controller";

const router = Router();

router.post("/", validate(createClassNoteSchema), createClassNote);

router.get("/meeting/:meetCode", getMeetingNotes);
router.get("/student/:studentId", getStudentNotes);

router.delete("/:id", deleteClassNote);

export default router;