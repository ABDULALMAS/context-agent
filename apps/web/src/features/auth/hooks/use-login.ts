import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginResponse } from "@context-bot/core";
import type { LoginRequest } from "@context-bot/core";

import { apiClient } from "@/services/api-client";
import { authKeys } from "../auth.keys";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await apiClient.post("/auth/login", LoginResponse, credentials);

      return response.user;
    },

    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
    },
  });
};
