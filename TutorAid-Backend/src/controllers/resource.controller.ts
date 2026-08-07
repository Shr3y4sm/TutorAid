import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
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

export const uploadResource = asyncHandler(
  async (req: Request, res: Response) => {
    const resource =
      await ResourceService.uploadResource(
        req.body.teacher_id,
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
        queryString(req, "q")
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