"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { useLogin } from "@/features/auth";

export const LoginForm = () => {
  const router = useRouter();
  const login = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    login.reset();

    try {
      await login.mutateAsync({ username, password });

      router.replace("/");
      router.refresh();
    } catch {
      // Mutation error is displayed below.
    }
  };

  return (
    <main className="glow-home flex min-h-dvh items-center justify-center px-[22px]">
      <div className="w-full max-w-[400px]">
        <Logo />

        <h1 className="h3 mt-[44px]">Sign in</h1>

        <p className="mt-1.5 text-muted-foreground">
          Enter your username and password to continue.
        </p>

        <form onSubmit={submit} className="card-ring mt-[22px] flex flex-col gap-[14px] p-[28.8px]">
          <label className="flex flex-col gap-1.5 text-ui text-muted-foreground">
            Username
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
              required
              disabled={login.isPending}
              className="h-11 rounded-xl bg-surface px-3.5 text-[15px] text-foreground shadow-[var(--shadow-ring)] outline-none focus:bg-background focus:ring-2 focus:ring-brand-soft"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-ui text-muted-foreground">
            Password
            <span className="relative block">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={login.isPending}
                className="h-11 w-full rounded-xl bg-surface px-3.5 pr-12 text-[15px] text-foreground shadow-[var(--shadow-ring)] outline-none focus:bg-background focus:ring-2 focus:ring-brand-soft"
              />

              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-1 grid w-10 place-items-center rounded-lg text-subtle hover:bg-secondary hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </span>
          </label>

          {login.isError && (
            <p role="alert" className="text-sm text-destructive">
              {login.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="pill pill-dark mt-1 w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-[14px] text-ui text-subtle">Access is by invitation.</p>
      </div>
    </main>
  );
};
