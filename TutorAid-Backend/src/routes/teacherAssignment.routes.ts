import { Router } from "express";

import upload from "../middleware/upload";

import {
  getTeacherAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  uploadAssignmentFile,
} from "../controllers/teacherAssignment.controller";

import { validate } from "../middleware/validate.middleware";

import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "../validators/assignment.validator";

import {
    gradeSubmission
}
from "../controllers/grading.controller";

import {
    gradeSubmissionSchema
}
from "../validators/grading.validator";

const router = Router();

router.get("/", getTeacherAssignments);

router.post(
  "/upload",
  upload.single("file"),
  uploadAssignmentFile
);

router.post(
    "/",
    validate(createAssignmentSchema),
    createAssignment
);

router.put(
    "/:id",
    validate(updateAssignmentSchema),
    updateAssignment
);

router.delete("/:id", deleteAssignment);

router.patch(
    "/submission/:id/grade",
    validate(
        gradeSubmissionSchema
    ),
    gradeSubmission
);

export default router;