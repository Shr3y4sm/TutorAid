import { api } from "./client";

interface CallResponse {
  success: boolean;
  callId: string;
}

interface ActiveCallResponse {
  success: boolean;
  callId: string | null;
}

export async function createCall() {
  const response = await api<CallResponse>("/stream/create-call", {
    method: "POST",
  });

  return {
    callId: response.callId,
  };
}

export async function getActiveCall() {
  const response = await api<ActiveCallResponse>("/stream/active-call");

  return {
    callId: response.callId,
  };
}

export async function endCall() {
  await api("/stream/end-call", {
    method: "POST",
  });
}
