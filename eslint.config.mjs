import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import boundaries from "eslint-plugin-boundaries";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/coverage/**",
      "packages/db/src/generated/**",
      "**/next-env.d.ts",
    ],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "apps/api/scripts/*.ts",
            "packages/db/prisma.config.ts",
            "vitest.config.ts",
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "api", pattern: "apps/api/**" },
        { type: "web", pattern: "apps/web/src/**" },
        { type: "worker", pattern: "apps/worker/src/**" },
        { type: "agent", pattern: "packages/agent/src/**" },
        { type: "core", pattern: "packages/core/src/**" },
        { type: "db", pattern: "packages/db/src/**" },
        { type: "email", pattern: "packages/email/src/**" },
        { type: "eval", pattern: "packages/eval/src/**" },
        { type: "executor", pattern: "packages/executor/src/**" },
        { type: "models", pattern: "packages/models/src/**" },
        { type: "queue", pattern: "packages/queue/src/**" },
        { type: "units", pattern: "packages/units/src/**" },
        { type: "web-context", pattern: "packages/web-context/src/**" },
      ],
    },
    rules: {
      "no-unused-vars": "off",
      "no-console": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message: "Use named exports except in Next.js entry points and config files.",
        },
        {
          selector: "ExportDefaultDeclaration > FunctionDeclaration",
          message: "Use a const arrow function for a Next.js default export.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@context-bot/*/src/**",
                "@context-bot/*/dist/**",
                "@context-bot/*/*",
                "**/packages/*/src/**",
              ],
              message: "Import workspace packages through their public entry point.",
            },
          ],
        },
      ],
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      "prefer-arrow-callback": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkAllOrigins: true,
          policies: [
            {
              allow: { to: { module: { origin: "external" } } },
            },
            {
              allow: { to: { module: { origin: "core" } } },
            },
            {
              from: { element: { type: "db" } },
              allow: { to: { element: { type: "core" } } },
            },
            {
              from: { element: { type: "queue" } },
              allow: { to: { element: { types: { anyOf: ["core", "db"] } } } },
            },
            {
              from: { element: { type: "web-context" } },
              allow: { to: { element: { type: "core" } } },
            },
            {
              from: { element: { type: "models" } },
              allow: { to: { element: { type: "core" } } },
            },
            {
              from: { element: { type: "units" } },
              allow: {
                to: { element: { types: { anyOf: ["core", "models", "web-context"] } } },
              },
            },
            {
              from: { element: { type: "agent" } },
              allow: {
                to: { element: { types: { anyOf: ["core", "models", "units"] } } },
              },
            },
            {
              from: { element: { type: "executor" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["core", "db", "queue", "units", "agent"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "email" } },
              allow: { to: { element: { types: { anyOf: ["core", "db"] } } } },
            },
            {
              from: { element: { type: "eval" } },
              allow: { to: { element: { types: { anyOf: ["agent", "core", "models"] } } } },
            },
            {
              from: { element: { type: "api" } },
              allow: {
                to: {
                  element: {
                    types: { anyOf: ["core", "db", "queue", "executor", "agent", "email"] },
                  },
                },
              },
            },
            {
              from: { element: { type: "worker" } },
              allow: {
                to: {
                  element: { types: { anyOf: ["core", "db", "queue", "executor", "email"] } },
                },
              },
            },
            {
              from: { element: { type: "web" } },
              allow: { to: { element: { type: "core" } } },
            },
            {
              from: { element: { type: "web" } },
              disallow: { to: { module: { origin: "external", source: "@context-bot/*" } } },
            },
            {
              from: { element: { type: "web" } },
              allow: {
                to: { module: { origin: "external", source: "@context-bot/core" } },
              },
            },
          ],
        },
      ],
    },
  },

  {
    files: ["apps/web/**/*.{ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-html-link-for-pages": "off",
    },
  },

  {
    files: [
      "apps/web/src/app/**/page.tsx",
      "apps/web/src/app/**/layout.tsx",
      "apps/web/src/app/**/route.ts",
      "apps/web/src/app/**/loading.tsx",
      "apps/web/src/app/**/error.tsx",
      "apps/web/src/app/**/not-found.tsx",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration > FunctionDeclaration",
          message: "Use a const arrow function for a Next.js default export.",
        },
      ],
    },
  },

  {
    files: ["apps/api/scripts/**/*.{ts,tsx}"],
    rules: {
      "no-console": "off",
    },
  },

  // TODO(P0-A): replace the startup message with the shared structured logger.
  {
    files: ["apps/api/src/server.ts"],
    rules: {
      "no-console": "warn",
    },
  },

  {
    files: [
      "**/*.config.{js,mjs,cjs,ts}",
      "**/next.config.*",
      "**/prisma.config.*",
      "**/vitest.config.*",
    ],
    rules: {
      "no-restricted-syntax": "off",
    },
  },

  prettier,
]);
