import { ErrorCode, ErrorEnvelope } from "@context-bot/core";
import type { ErrorCode as ErrorCodeType } from "@context-bot/core";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ResponseSchema<T> = {
  safeParse: (value: unknown) => { success: true; data: T } | { success: false };
};

type ApiRequestOptions = Pick<RequestInit, "cache" | "headers">;

export class ApiError extends Error {
  readonly code: ErrorCodeType;
  readonly status: number;

  constructor(code: ErrorCodeType, status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

const invalidResponseError = (status: number) =>
  new ApiError(ErrorCode.INTERNAL, status, "The server returned an invalid response.");

const handleResponse = async <T>(response: Response, schema: ResponseSchema<T>): Promise<T> => {
  if (response.status === 204) {
    const parsed = schema.safeParse(undefined);

    if (!parsed.success) {
      throw invalidResponseError(response.status);
    }

    return parsed.data;
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw invalidResponseError(response.status);
  }

  if (!response.ok) {
    const parsedError = ErrorEnvelope.safeParse(data);

    if (!parsedError.success) {
      throw invalidResponseError(response.status);
    }

    throw new ApiError(
      parsedError.data.error.code,
      response.status,
      parsedError.data.error.message,
    );
  }

  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw invalidResponseError(response.status);
  }

  return parsed.data;
};

export const apiClient = {
  post: async <T>(
    path: string,
    schema: ResponseSchema<T>,
    body?: unknown,
    options?: ApiRequestOptions,
  ): Promise<T> => {
    let response: Response;

    try {
      response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        ...(body !== undefined && { body: JSON.stringify(body) }),
        ...options,
      });
    } catch {
      throw new ApiError(ErrorCode.INTERNAL, 0, "Unable to reach the server.");
    }

    return handleResponse(response, schema);
  },

  get: async <T>(
    path: string,
    schema: ResponseSchema<T>,
    options?: ApiRequestOptions,
  ): Promise<T> => {
    let response: Response;

    try {
      response = await fetch(`${API_URL}${path}`, {
        method: "GET",
        credentials: "include",
        ...options,
      });
    } catch {
      throw new ApiError(ErrorCode.INTERNAL, 0, "Unable to reach the server.");
    }

    return handleResponse(response, schema);
  },
};
