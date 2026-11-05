# AGENTS.md

Context Agent (Context.dev Bot): a monorepo for an autonomous prospecting and outreach agent.
Stack: pnpm + Turborepo, TypeScript (strict), Express 5 (apps/api), Next.js + React + Tailwind +
TanStack Query (apps/web, deployed on Vercel), Prisma 7 + Supabase Postgres, Zod.
Authentication is the reference implementation. Follow its patterns and do not rewrite it without
being asked.

## Status

Implemented: authentication (login, logout, server-side sessions, protected routes).
Planned, not built: worker, job queue (pg-boss, unproven), events, agent, web-context, models,
units, email, Redis caching. Do not build planned features unless the task asks for them.

## Working rules

- Make the smallest change that solves the task. No unrelated refactoring.
- Do not add dependencies, packages or abstractions unless the task requires it. If you think one
  is needed, say so in your report instead of adding it.
- State assumptions and ambiguities in your final report.
- Before finishing run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`. Report what you
  ran and what failed. Never claim a check passed if you did not run it.
- Never log, print or commit secrets, tokens, passwords or full email bodies.
- Make separate commits per scope (for example dependencies, lint config, feature code).

## Safety (applies to you, the coding agent)

- Never run `prisma migrate reset`, `db push`, `migrate deploy` or any destructive SQL against a
  database other than the local or dev database named in `.env`. Never run migrations against
  production.
- Migrations are append-only. Never edit or delete a migration that has been committed; add a new one.
- Never push to main, force-push, rewrite history, or commit `.env` files or secrets.
- Do not put real values in `.env` files you commit. Update `.env.example` instead.
- Tests never connect to the production Supabase project. Use a separate test database.

## Packages and allowed dependencies

Import another workspace package only through its public entry point (`@context-bot/<name>`),
never from its `src`. Declare only dependencies you actually import. Do not create a package just
because it appears below; this list says what is permitted if the package exists.

- core: none. Browser-safe. Zod schemas, inferred types, enums, error codes only. No Node APIs, no I/O.
- db: core
- queue: core, db
- web-context, models: core
- units: core, models, web-context
- agent: core, models, units
- executor: core, db, queue, units, agent
- email: core, db
- apps/api: core, db, queue, executor, agent, email
- apps/worker: core, db, queue, executor, email
- apps/web: core only. Never import db, queue or other server packages.

Logic used by both api and worker belongs in a package, not in apps/api.
Redis is for caching and key tracking only. There is no cache package until a concrete use exists.

## Code style

- Named exports only. Default exports only where Next.js requires them (page, layout, route,
  loading, error, not-found, config files): define `const Page = () => {...}; export default Page;`.
- Use `export const` arrow functions for every function and component. No `function` declarations.
  In `.tsx`, write generics as `<T,>(...) =>`.
- Group related functions into named object exports for services, repositories and controllers
  (e.g. `authService.login()`, `userRepository.findById()`). Do not export these functions
  individually. Standalone functions, hooks and components remain individual `export const`
  exports.
- Use `type`, never `interface`. Use string unions or `z.enum`, never TypeScript `enum` in app code.
- Use `import type` for type-only imports.
- Export a Zod schema and its inferred type under the same name:
  `export const LoginRequest = z.object({...}); export type LoginRequest = z.infer<typeof LoginRequest>;`
- No re-export barrel files. The only allowed `index.ts` files are each package's root `index.ts`
  (its public API, with explicit exports) and `routes/index.ts` in apps/api (which composes
  routers). Controllers, services, repositories, components and hooks have no `index.ts`; import
  the file directly.
- File names are kebab-case. Backend files are `<feature>.<layer>.ts` (auth.routes.ts,
  auth.controller.ts, auth.service.ts, session.repository.ts). Components and types are
  PascalCase; functions and variables are camelCase.
- No `utils.ts` or `helpers.ts`; name modules by what they do.
- `async/await` only. No `.then` chains. No `console.*` in application code (scripts are exempt).
- Keep the existing ESM specifier style in packages that use NodeNext (`.js` extensions).
- Comments explain why, not what. No commented-out code. TODOs say what is needed.

## Backend (apps/api)

- Layers: routes (URL and middleware only) -> controller (parse input, call service, shape the HTTP
  response) -> service (use-case logic) -> repository (database queries only).
- Validate every request body, query and param with a Zod schema from `@context-bot/core`, in the
  controller: `schema.parse(req.body)`. Do not build validation middleware frameworks.
- Express 5 forwards rejected async handlers. Do not wrap handlers in `try/catch` only to call
  `next(error)`.
- Expected request-level failures throw `AppError(code, status, message)`. Codes come from the
  `ErrorCode` enum in core. One central error middleware maps `AppError` and `ZodError` to
  `{ "error": { "code", "message", "details"? } }`. Unexpected errors return a generic 500 and are
  logged without secrets.
- Response body types come from core. Do not hand-write them.
- The authenticated user (id, role) is available through a typed helper, not untyped `res.locals`.
  Use `requireAuth`, and `requireRole(...)` only on routes that need it.
- `trust proxy` is configured from `TRUST_PROXY_HOPS` (default 0) to match the real deployment.
  Never set it to `true`.
- Admin scripts live in `apps/api/scripts/`.

## API conventions

- URLs: plural kebab-case nouns (`/runs`, `/prospects/:id`). Actions that do not fit a noun use a
  sub-resource (`POST /runs/:id/cancel`).
- Status codes: 200 read, 201 created, 204 no body, 400 validation, 401 not logged in, 403 wrong
  role, 404 not found, 429 rate limited. Never return 200 with an error body.
- List responses are `{ items, nextCursor }` with cursor pagination. Do not use offsets.
- IDs are UUID strings. Dates are ISO 8601 UTC strings (`z.string().datetime()`).
- Request and response schemas come from core. Do not return Prisma records directly.

## Contracts (packages/core)

- Zod schemas are the single source for request and response bodies, events, plans, unit inputs
  and outputs, roles and error codes. Types are inferred from them. Never import Prisma types here.
- The web client and the API both import these schemas.

## Database (packages/db)

- Prisma is used only inside `packages/db`. Repositories are objects of `export const` functions
  (for example `userRepository.findById`).
- `passwordHash` is globally omitted by the Prisma client. Only an explicit
  `findUserWithPasswordHash` returns it. Verify this against the Prisma 7 types before relying on it.
- Conventions: UUID primary keys, snake_case columns mapped to camelCase fields, `createdAt` and
  `updatedAt` on every table, timestamps in UTC.
- Runtime uses the Supabase transaction pooler (`DATABASE_URL`, port 6543). Migrations use
  `DIRECT_URL` (session pooler, port 5432). Do not use advisory locks, LISTEN/NOTIFY or other
  session-level features in runtime code.
- Keep transactions short. Never hold one open during slow work (web fetches, model calls).
- When transactions are introduced, `withTransaction` owns the boundary and repository functions
  that take part accept a transaction client. Do not add that parameter before it is needed.

## Events and jobs (principles decided; implementation not built yet)

- PostgreSQL is the source of truth for jobs and run state. Redis is never the queue.
- A state change, its run event and any job it creates commit in one transaction.
- Run events are written through a single `emitEvent` function; the per-run sequence comes from a
  counter updated in the same transaction. Do not write event rows anywhere else.
- Capability code (web-context, units, agent, executor) returns `Result<T, Failure>` for expected
  failures instead of throwing. Failures become events and statuses.
- The queue library and its adapter are not chosen until the pg-boss spike passes. Do not adopt a
  queue API as a convention before that.

## Configuration and logging

- `process.env` is read only in each process's config module (`src/config/env.ts`), validated with
  Zod at startup. Everything else imports the parsed config.
- Only variables prefixed `NEXT_PUBLIC_` reach the browser. Never expose server variables.
- Use structured logging with request ids once the logger exists; redact cookies, authorization
  headers, tokens and passwords.

## Frontend (apps/web)

- Organize by feature: `features/<name>/` contains `<name>.api.ts` (API functions), `<name>.keys.ts`
  (query keys), `hooks/use-*.ts` (one hook per file) and `components/` (UI only). A component file
  contains only the component. Never define a hook or call the API inside a component file.
  Generic hooks with no feature go in `src/hooks/`; non-React helpers in `src/lib/`; shared UI
  primitives in `src/components/ui/`. Pages in `app/` only assemble feature components.
- All API calls go through the shared API client, which takes the response schema, parses the
  response and throws `ApiError { code, status, message }`. Do not call `fetch` elsewhere.
- Server state uses TanStack Query with centralized query keys. Do not copy server data into a
  client store. Zustand is for UI-only state.
- Every screen that loads data handles loading, empty and error states with shared components.
- Clear user-specific query data on logout.
- Components are server components by default. Add `"use client"` only to files that need state,
  effects or browser APIs, and keep those files small.
- Styling is Tailwind only, with design tokens as CSS variables. Use `cn()` for class merging and
  `cva` for variants. No inline styles and no CSS modules.
- Forms use controlled inputs validated with the core Zod schema (`safeParse`). Do not add a form
  library without asking.
- Never use `dangerouslySetInnerHTML`.

## Dependencies

- Shared dependencies (zod, typescript, eslint) use one version across the workspace through the
  pnpm catalog. Do not add a second version.
- Prefer built-ins and existing dependencies. A new dependency needs a one-line reason in your report.

## Testing and CI

- Vitest. Write focused tests: auth behavior, API error mapping, and (when built) transaction
  rollback of state, event and job. Tests sit next to the code as `*.test.ts`. No coverage targets.
- CI runs install, typecheck, lint, test and build. Do not merge with red checks.

## Decisions log

Append one line per non-obvious decision to `docs/decisions.md` in the form
`YYYY-MM-DD: decision, reason`. Do not rewrite earlier lines.
