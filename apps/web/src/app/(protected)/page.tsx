"use client";

import { useLogout, useMe } from "@/features/auth";

const HomePage = () => {
  const { data: user, isLoading } = useMe();
  const logout = useLogout();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Welcome</h1>

      {user && <p className="text-muted-foreground">Logged in as: {user.username}</p>}

      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="rounded-md bg-destructive px-4 py-2 text-white disabled:opacity-50"
      >
        {logout.isPending ? "Logging out..." : "Logout"}
      </button>
    </main>
  );
};

export default HomePage;
