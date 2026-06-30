import { api } from "./client";

export async function getCourses() {
  return api("/courses");
}