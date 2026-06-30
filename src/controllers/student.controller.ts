import { Request, Response } from "express";
import { dashboard } from "../data/mockData";

export function getDashboard(
  _req: Request,
  res: Response
) {
  res.json(dashboard);
}