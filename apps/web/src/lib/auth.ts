import { headers } from "next/headers";

import type { AuthUser } from "@/features/auth/hooks/use-me";

type MeResponse = {
  user: AuthUser;
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const cookie = (await headers()).get("cookie");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to verify your session.");
  }

  const data = (await response.json()) as MeResponse;

  return data.user;
};
