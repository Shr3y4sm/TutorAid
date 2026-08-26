import { Router } from "express";

import {
  uploadResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
  searchResources,
  getResourcesBySubject,
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderPath,
} from "../controllers/resource.controller";

import { upload } from "../middleware/upload.middleware";
import { validate } from "../middleware/validate.middleware";
import { requireTeacher } from "../middleware/auth.middleware";

import {
  uploadResourceSchema,
  updateResourceSchema,
  createFolderSchema,
  updateFolderSchema,
} from "../validators/resource.validator";

const router = Router();

// -----------------------------------------------------------------
// Folder routes — MUST be registered before the generic "/:id"
// route so "folders" is never treated as an id.
// -----------------------------------------------------------------

router.post(
  "/folders",
  requireTeacher,
  validate(createFolderSchema),
  createFolder
);

router.get("/folders", getFolders);

router.patch(
  "/folders/:folderId",
  requireTeacher,
  validate(updateFolderSchema),
  updateFolder
);

router.delete(
  "/folders/:folderId",
  requireTeacher,
  deleteFolder
);

router.get(
  "/folders/:folderId/path",
  getFolderPath
);

// -----------------------------------------------------------------
// Resource routes
// -----------------------------------------------------------------

router.post(
  "/",
  requireTeacher,
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
  requireTeacher,
  validate(updateResourceSchema),
  updateResource
);

router.delete(
  "/:id",
  requireTeacher,
  deleteResource
);

export default router;