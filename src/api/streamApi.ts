import { apiRequest } from "./apiClient";

export interface StreamTokenResponse {
  success: boolean;
  token: string;
  userId: string;
}

export async function getStreamToken(userId: string) {
  return apiRequest<StreamTokenResponse>(
    "/stream/token",
    {
      method: "POST",
      body: JSON.stringify({
        userId,
      }),
    }
  );
}