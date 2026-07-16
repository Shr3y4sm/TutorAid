import { api } from "./client";

export interface Course {
  id: string;
  course_name: string;
  description: string;
  course_code: string;
  semester: number;
  section: string;
}

interface CourseResponse {
  success: boolean;
  data: Course[];
}

interface SingleCourseResponse {
  success: boolean;
  data: Course;
}

export async function getCourses(
  studentId: string
): Promise<Course[]> {
  const response =
    await api<CourseResponse>(
      `/courses?studentId=${studentId}`
    );

  return response.data ?? [];
}

export async function getCourse(
  id: string
): Promise<Course> {
  const response =
    await api<SingleCourseResponse>(
      `/courses/${id}`
    );

  return response.data;
}