import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { z } from "zod";

dotenv.config({
  path: fileURLToPath(new URL("../../../.env", import.meta.url)),
});

const envSchema = z.object({
  DATABASE_URL: z
    .url()
    .refine((url) => url.startsWith("postgresql://") || url.startsWith("postgres://")),
});

export const env = envSchema.parse(process.env);
