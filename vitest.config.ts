import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@\//,
        replacement: `${fileURLToPath(new URL("./apps/web/src", import.meta.url))}/`,
      },
    ],
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    coverage: {
      provider: "v8",
      include: ["apps/**/src/**/*.{ts,tsx}", "packages/**/src/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.spec.ts", "**/index.ts"],
    },
  },
});
