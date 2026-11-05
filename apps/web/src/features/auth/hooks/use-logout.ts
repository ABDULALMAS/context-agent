"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LogoutResponse } from "@context-bot/core";

import { apiClient } from "@/services/api-client";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout", LogoutResponse),

    onSettled: () => {
      // Clear cached user and other potentially user-specific data.
      queryClient.clear();

      router.replace("/login");
      router.refresh();
    },
  });
};
