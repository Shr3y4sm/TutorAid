import { api } from "./client";

export interface StreamTokenResponse {
  success: boolean;
  token: string;
  userId: string;
}

export async function getStreamToken(userId: string) {
  return api<StreamTokenResponse>(
    "/stream/token",
    {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
    }
  );
}
