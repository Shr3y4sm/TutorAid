import { API_BASE_URL } from "@/config/env";

export interface ApiOptions
  extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function api<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    10000
  );

  const isFormData =
    options.body instanceof FormData;

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,

      body: isFormData
        ? (options.body as FormData)
        : options.body != null
        ? JSON.stringify(options.body)
        : undefined,

      headers: {
        ...(isFormData
          ? {}
          : {
              "Content-Type":
                "application/json",
            }),
        ...(options.headers ?? {}),
      },
    });

    clearTimeout(timeout);

    const json = await response.json();

    if (!response.ok) {
      throw new Error(
        json.message ??
          "Something went wrong."
      );
    }

    return json;

  } finally {
    clearTimeout(timeout);
  }
}