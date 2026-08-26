import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { ResourceService } from "../services/resource.service";

/** Safely extract a string query param (handles arrays / ParsedQs). */
function queryString(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

/** Safely extract a string route param (handles arrays). */
function routeParam(req: Request, key: string): string {
  const value = req.params[key];
  return typeof value === "string" ? value : "";
}

/** Authenticated caller id (guaranteed by the authenticate middleware). */
function authUserId(req: Request): string {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized.");
  }
  return req.user.id;
}

export const uploadResource = asyncHandler(
  async (req: Request, res: Response) => {
    // Teacher identity is derived from the auth token, not the body.
    const resource =
      await ResourceService.uploadResource(
        authUserId(req),
        req.body,
        req.file!
      );

    return ApiResponse.created(
      res,
      resource,
      "Resource uploaded."
    );
  }
);

export const getResources = asyncHandler(
  async (req: Request, res: Response) => {
    const page = Number(queryString(req, "page") ?? 1);
    const limit = Number(queryString(req, "limit") ?? 20);

    const resources =
      await ResourceService.getResources(
        page,
        limit,
        queryString(req, "subject"),
        queryString(req, "category"),
        queryString(req, "q"),
        queryString(req, "folder")
      );

    return ApiResponse.success(
      res,
      resources
    );
  }
);

export const getResource = asyncHandler(
  async (req: Request, res: Response) => {
    const resource =
      await ResourceService.getResource(
        routeParam(req, "id")
      );

    return ApiResponse.success(
      res,
      resource
    );
  }
);

export const updateResource = asyncHandler(
  async (req: Request, res: Response) => {
    const resource =
      await ResourceService.updateResource(
        routeParam(req, "id"),
        req.body
      );

    return ApiResponse.success(
      res,
      resource,
      "Resource updated."
    );
  }
);

export const deleteResource = asyncHandler(
  async (req: Request, res: Response) => {
    await ResourceService.deleteResource(
      routeParam(req, "id")
    );

    return ApiResponse.noContent(res);
  }
);

export const searchResources = asyncHandler(
  async (req: Request, res: Response) => {
    const resources =
      await ResourceService.searchResources(
        queryString(req, "q") ?? ""
      );

    return ApiResponse.success(
      res,
      resources
    );
  }
);

export const getResourcesBySubject = asyncHandler(
  async (req: Request, res: Response) => {
    const resources =
      await ResourceService.getResourcesBySubject(
        routeParam(req, "subject")
      );

    return ApiResponse.success(
      res,
      resources
    );
  }
);

export const getResourceStats = asyncHandler(
  async (req: Request, res: Response) => {
    const stats =
      await ResourceService.getResourceStats();

    return ApiResponse.success(
      res,
      stats
    );
  }
);

// -----------------------------------------------------------------
// Folder repository handlers
// -----------------------------------------------------------------

/**
 * GET /resources/folders?parent=root|<uuid>
 * Teachers list their own tree; students list every folder at the
 * requested level (read-only).
 */
export const getFolders = asyncHandler(
  async (req: Request, res: Response) => {
    const parentParam = queryString(req, "parent");

    // Absent or "root" → repository root level.
    const parentId =
      !parentParam || parentParam === "root"
        ? null
        : parentParam;

    const folders =
      await ResourceService.getFolders({
        authUserId: req.user?.id,
        role: req.user?.role,
        parentId,
      });

    return ApiResponse.success(res, folders);
  }
);

/** POST /resources/folders — teacher only. */
export const createFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const folder =
      await ResourceService.createFolder(
        authUserId(req),
        req.body.name,
        req.body.parent_id ?? null
      );

    return ApiResponse.created(
      res,
      folder,
      "Folder created."
    );
  }
);

/** PATCH /resources/folders/:folderId — teacher only (rename). */
export const updateFolder = asyncHandler(
  async (req: Request, res: Response) => {
    const folder =
      await ResourceService.renameFolder(
        authUserId(req),
        routeParam(req, "folderId"),
        req.body.name
      );

    return ApiResponse.success(
      res,
      folder,
      "Folder renamed."
    );
  }
);

/** DELETE /resources/folders/:folderId — teacher only. */
export const deleteFolder = asyncHandler(
  async (req: Request, res: Response) => {
    await ResourceService.deleteFolder(
      authUserId(req),
      routeParam(req, "folderId")
    );

    return ApiResponse.noContent(res);
  }
);

/** GET /resources/folders/:folderId/path — breadcrumb trail. */
export const getFolderPath = asyncHandler(
  async (req: Request, res: Response) => {
    const path = await ResourceService.getFolderPath(
      routeParam(req, "folderId")
    );

    return ApiResponse.success(res, path);
  }
);