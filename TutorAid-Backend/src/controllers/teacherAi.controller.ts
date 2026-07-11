import { Request, Response } from "express";
import { aiTools } from "../data/teacherAi.data";

export function getAiTools(
  _req: Request,
  res: Response
) {
  res.json({
    success: true,
    data: aiTools,
  });
}
