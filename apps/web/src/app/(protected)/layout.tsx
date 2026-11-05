import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { authKeys } from "@/features/auth/auth.keys";
import { getCurrentUser } from "@/lib/auth";

const AuthenticatedContent = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const queryClient = new QueryClient();

  queryClient.setQueryData(authKeys.me, user);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
};

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <p className="text-sm text-muted-foreground">Checking your session...</p>
        </main>
      }
    >
      <AuthenticatedContent>{children}</AuthenticatedContent>
    </Suspense>
  );
};

export default ProtectedLayout;
