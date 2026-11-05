import dotenv from "dotenv";
import { defineConfig } from "prisma/config";
import { fileURLToPath } from "node:url";
import { z } from "zod";

dotenv.config({
  path: fileURLToPath(new URL("../../.env", import.meta.url)),
});

const envSchema = z.object({
  DIRECT_URL: z
    .url()
    .refine((url) => url.startsWith("postgresql://") || url.startsWith("postgres://")),
});

const env = envSchema.parse(process.env);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env.DIRECT_URL,
  },
});
