"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { apiClient } from "@/services/api-client";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post("/auth/logout"),

    onSettled: () => {
      // Clear cached user and other potentially user-specific data.
      queryClient.clear();

      router.replace("/login");
      router.refresh();
    },
  });
};
