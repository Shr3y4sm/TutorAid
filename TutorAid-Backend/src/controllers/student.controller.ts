import { Request, Response } from "express";
import { dashboard } from "../data/student.data";

export function getDashboard(
  _req: Request,
  res: Response
) {
  res.status(200).json({
    success: true,
    data: dashboard,
  });
}