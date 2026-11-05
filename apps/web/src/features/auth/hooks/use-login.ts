import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/services/api-client";
import { type AuthUser } from "./use-me";
import { authKeys } from "../auth.keys";

type LoginInput = {
  username: string;
  password: string;
};

type LoginResponse = {
  user: AuthUser;
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await apiClient.post<LoginResponse>("/auth/login", credentials);

      return response.user;
    },

    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
    },
  });
};
