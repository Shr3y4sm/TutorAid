import { api } from "./client";

export async function getAssignments() {
  return api("/assignments");
}