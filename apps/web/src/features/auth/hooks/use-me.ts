import { useQuery } from "@tanstack/react-query";
import { MeResponse } from "@context-bot/core";
import type { AuthUser } from "@context-bot/core";

import { apiClient } from "@/services/api-client";
import { authKeys } from "../auth.keys";

export type { AuthUser } from "@context-bot/core";

const getMe = async (): Promise<AuthUser> => {
  const response = await apiClient.get("/auth/me", MeResponse);

  return response.user;
};

export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    retry: false,
  });
};
