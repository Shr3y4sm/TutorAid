import { API_BASE_URL } from "@/config/env";

export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    }
  );

  if (!response.ok) {
    throw new Error(
      `API Error ${response.status}`
    );
  }

  return response.json();
}