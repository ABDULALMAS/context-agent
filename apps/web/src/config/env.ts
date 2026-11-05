import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_API_URL: z.url().optional(),
});

const parsedEnv = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (parsedEnv.NODE_ENV === "production" && !parsedEnv.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is required in production.");
}

export const env = {
  ...parsedEnv,
  NEXT_PUBLIC_API_URL: parsedEnv.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
};
