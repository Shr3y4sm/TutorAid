import { api } from "./client";

export async function createCall() {
  const response = await api("/stream/create-call", {
    method: "POST",
  });

  return response.data;
}

export async function getActiveCall() {
  const response = await api("/stream/active-call");

  return response.data;
}

export async function endCall() {
  await api("/stream/end-call", {
    method: "POST",
  });
}