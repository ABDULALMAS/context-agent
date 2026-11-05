import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/services/api-client";
import { authKeys } from "../auth.keys";

export type AuthUser = {
  id: string;
  username: string;
};

type MeResponse = {
  user: AuthUser;
};

const getMe = async (): Promise<AuthUser> => {
  const response = await apiClient.get<MeResponse>("/auth/me");

  return response.user;
};

export const useMe = () => {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    retry: false,
  });
};
