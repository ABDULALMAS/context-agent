import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign in · Context.dev Bot",
  description: "Sign in to Context.dev Bot. Access is by invitation.",
  openGraph: {
    title: "Sign in · Context.dev Bot",
    description: "Sign in to Context.dev Bot. Access is by invitation.",
  },
};

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
