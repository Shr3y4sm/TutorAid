import { Request, Response } from "express";
import {
  dashboard,
  profile,
} from "../data/student.data";

export function getDashboard(
  _req: Request,
  res: Response
) {
  res.status(200).json({
    success: true,
    data: dashboard,
  });
}

export function getProfile(
  _req: Request,
  res: Response
) {
  res.status(200).json({
    success: true,
    data: profile,
  });
}
