import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["apps/**/src/**/*.{test,spec}.{ts,tsx}", "packages/**/src/**/*.{test,spec}.{ts,tsx}"],

    coverage: {
      provider: "v8",
      include: ["apps/**/src/**/*.{ts,tsx}", "packages/**/src/**/*.ts"],
      exclude: ["**/*.test.ts", "**/*.spec.ts", "**/index.ts"],
    },
  },
});
