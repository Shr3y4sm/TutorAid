import { API_BASE_URL } from "@/config/env";

export async function api<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("🌐 URL:", url);

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeout);

    console.log("🌐 STATUS:", response.status);

    const json = await response.json();

    console.log("🌐 JSON:", JSON.stringify(json));

    return json;
  } catch (err) {
    clearTimeout(timeout);

    console.log("🌐 FETCH ERROR:", err);

    throw err;
  }
}