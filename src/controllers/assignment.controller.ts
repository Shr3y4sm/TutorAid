import { Request, Response } from "express";
import { assignments } from "../data/mockData";

export function getAssignments(
  _req: Request,
  res: Response
) {
  res.json(assignments);
}