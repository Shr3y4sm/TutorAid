import { Request, Response } from "express";
import { courses } from "../data/mockData";

export function getCourses(
  _req: Request,
  res: Response
) {
  res.json(courses);
}