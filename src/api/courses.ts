import { api } from "./client";

export interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  students: number;
  color: string;
  description: string;
}

interface CourseResponse {
  success: boolean;
  data: Course[];
}

interface SingleCourseResponse {
  success: boolean;
  data: Course;
}

export async function getCourses() {
  const response = await api<CourseResponse>("/courses");
  return response.data;
}

export async function getCourse(id: string) {
  const response = await api<SingleCourseResponse>(
    `/courses/${id}`
  );

  return response.data;
}