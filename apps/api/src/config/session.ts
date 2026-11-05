import { env } from "./env.js";

export const SESSION_COOKIE_NAME = "session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const SESSION_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
