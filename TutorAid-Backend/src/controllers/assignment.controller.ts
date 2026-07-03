import { Request, Response } from "express";
import { assignments } from "../data/assignment.data";

export function getAssignments(
  _req: Request,
  res: Response
) {
  res.status(200).json({
    success: true,
    data: assignments,
  });
}
