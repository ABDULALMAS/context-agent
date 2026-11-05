import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";

import { getCurrentUser } from "@/lib/auth";

const AuthContent = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return children;
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-dvh items-center justify-center">
          <p className="text-sm text-muted-foreground">Checking your session...</p>
        </main>
      }
    >
      <AuthContent>{children}</AuthContent>
    </Suspense>
  );
};

export default AuthLayout;
