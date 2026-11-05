import { headers } from "next/headers";
import { ErrorCode, MeResponse } from "@context-bot/core";
import type { AuthUser } from "@context-bot/core";

import { ApiError, apiClient } from "@/services/api-client";

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const cookie = (await headers()).get("cookie");
  const options: RequestInit = { cache: "no-store" };

  if (cookie) {
    options.headers = { cookie };
  }

  try {
    const response = await apiClient.get("/auth/me", MeResponse, options);

    return response.user;
  } catch (error) {
    if (error instanceof ApiError && error.code === ErrorCode.UNAUTHENTICATED) {
      return null;
    }

    throw error;
  }
};
