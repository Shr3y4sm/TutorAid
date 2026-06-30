import { Request, Response } from "express";
import { courses } from "../data/course.data";

export function getCourses(
  _req: Request,
  res: Response
) {
  res.status(200).json({
    success: true,
    data: courses,
  });
}

export function getCourse(
  req: Request,
  res: Response
) {
  const course = courses.find(
    (c) => c.id === req.params.id
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: course,
  });
}