import { API_BASE_URL } from "@/config/env";
import supabase from "@/config/supabase";

export interface ApiOptions
  extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Custom error that preserves the HTTP status code so callers
 * can distinguish 401 (unauthorized) from other failures.
 */
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
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

  // -------------------------------------------------------------------
  // Automatically attach the current Supabase access token so every
  // backend request passes the authenticate middleware.
  // -------------------------------------------------------------------
  const {
    data: { session },
  } = await supabase.auth.getSession();

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
        ...(session?.access_token
          ? {
              Authorization: `Bearer ${session.access_token}`,
            }
          : {}),
        ...(options.headers ?? {}),
      },
    });

    clearTimeout(timeout);

    const json = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        json.message ?? "Something went wrong."
      );
    }

    return json;
  } finally {
    clearTimeout(timeout);
  }
}
