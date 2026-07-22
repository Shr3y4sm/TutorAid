import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ResourceService } from "../services/resource.service";

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
    const page = Number(req.query.page ?? 1);

const limit = Number(req.query.limit ?? 20);

const resources =
await ResourceService.getResources(

    page,

    limit,

    req.query.subject as string,

    req.query.category as string,

    req.query.q as string

);

return ApiResponse.success(
    res,
    resources
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
        req.params.id
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
        req.params.id,
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
      req.params.id
    );

    return ApiResponse.noContent(res);
  }
);

export const searchResources = asyncHandler(
  async (req: Request, res: Response) => {
    const resources =
      await ResourceService.searchResources(
        req.query.q as string
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
        req.params.subject
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