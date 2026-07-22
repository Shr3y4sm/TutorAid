import { Router } from "express";

import {
  uploadResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  searchResources,
  getResourcesBySubject,
} from "../controllers/resource.controller";

import { upload } from "../middleware/upload.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  uploadResourceSchema,
  updateResourceSchema,
} from "../validators/resource.validator";

const router = Router();

router.post(
  "/",
  upload.single("file"),
  uploadResource
);

router.get("/", getResources);

router.get("/search", searchResources);

router.get(
  "/subject/:subject",
  getResourcesBySubject
);

router.get("/:id", getResource);

router.patch(
  "/:id",
  validate(updateResourceSchema),
  updateResource
);

router.delete("/:id", deleteResource);

export default router;