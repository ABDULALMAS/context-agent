# Context Agent

**An autonomous AI system for customer discovery and outreach.**

Context Agent is a platform designed to help businesses discover potential customers, research them using web context, and execute personalized outreach through autonomous AI agents.

The goal is to bring together three capabilities:

- **Agent Systems** — autonomous execution, tool orchestration, state management, and decision-making.
- **Web Context Infrastructure** — discovering, fetching, extracting, and structuring information from the web.
- **Customer Discovery & Outreach** — identifying potential customers, understanding their needs, and generating personalized outreach.

## Architecture

Context Agent is built as a TypeScript monorepo using pnpm workspaces and Turborepo.

```text
context-agent/
├── apps/
│   ├── api/                 # Express API
│   ├── web/                 # Next.js application
│   └── worker/              # Background execution
│
├── packages/
│   ├── core/                # Shared contracts and schemas
│   ├── db/                  # Database access
│   ├── agent/               # Agent orchestration
│   ├── executor/             # Execution infrastructure
│   ├── models/               # LLM integrations
│   ├── web-context/          # Web discovery and extraction
│   ├── units/                # Agent capabilities
│   ├── queue/                # Background job processing
│   └── email/                # Email delivery
│
├── docs/
│   └── decisions.md
│
├── AGENTS.md
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

The architecture is being developed incrementally. Not all planned packages and capabilities are implemented yet.

## Tech Stack

| Layer            | Technology                   |
| ---------------- | ---------------------------- |
| Language         | TypeScript                   |
| Monorepo         | pnpm, Turborepo              |
| Frontend         | Next.js, React, Tailwind CSS |
| Server state     | TanStack Query               |
| Backend          | Node.js, Express 5           |
| Database         | PostgreSQL                   |
| ORM              | Prisma 7                     |
| Database hosting | Supabase                     |
| Validation       | Zod                          |
| Authentication   | Server-side sessions, Argon2 |
| Caching          | Redis (planned)              |
| Testing          | Vitest                       |

## Current Implementation

The initial application infrastructure and authentication system are implemented.

### Authentication

- Username and password authentication.
- Argon2 password hashing.
- Server-side sessions stored in PostgreSQL.
- Cryptographically random session tokens, stored as SHA-256 hashes.
- HTTP-only session cookies.
- Idle and absolute session expiration.
- Protected frontend routes and authenticated API endpoints.
- Role-based authorization foundations.

There is no public registration flow. Users are provisioned administratively.

### API

The backend follows a layered architecture:

```text
Routes → Controllers → Services → Repositories
```

- Routes define endpoints and middleware.
- Controllers handle HTTP input validation and responses.
- Services implement application use cases.
- Repositories handle database operations.

Shared request and response contracts are defined using Zod in `packages/core`.

### Web Application

The frontend uses Next.js and React.

- TanStack Query for server-state management.
- Shared API client for backend communication.
- Zod validation for API responses.
- Feature-oriented application structure.
- Protected application routes.

## Getting Started

### Prerequisites

- Node.js 24 or later
- pnpm 12
- A Supabase PostgreSQL database

### Clone the repository

```bash
git clone https://github.com/ABDULALMAS/context-agent.git
cd context-agent
```

### Install dependencies

```bash
pnpm install
```

### Environment configuration

Create a root `.env` file:

```bash
cp .env.example .env
```

Configure the required variables:

| Variable              | Description                              |
| --------------------- | ---------------------------------------- |
| `DATABASE_URL`        | PostgreSQL transaction pooler connection |
| `DIRECT_URL`          | PostgreSQL connection for migrations     |
| `APP_URL`             | Frontend origin used by API CORS         |
| `NEXT_PUBLIC_API_URL` | API URL exposed to the frontend          |
| `REDIS_URL`           | Redis connection, when required          |
| `TRUST_PROXY_HOPS`    | Number of trusted reverse proxy hops     |

Use your own development credentials. Never commit `.env` or expose server-side secrets to the browser.

### Development

Start the development environment:

```bash
pnpm dev
```

### Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

## Development Principles

The project follows a few architectural principles:

- PostgreSQL is the source of truth for persistent application and execution state.
- Redis is intended for caching and key tracking, not job persistence.
- Shared contracts live in `packages/core`.
- Prisma access is isolated inside `packages/db`.
- Workspace packages expose functionality through public entry points.
- API and worker logic should share application capabilities through packages rather than depending on one another.
- Long-running operations must not hold database transactions open.
- Authentication and authorization are handled centrally.
- Prefer small, focused modules over unnecessary abstractions.

See [`AGENTS.md`](./AGENTS.md) for detailed development conventions and [`docs/decisions.md`](./docs/decisions.md) for architectural decisions.

## Project Direction

The intended development progression is:

1. Establish reliable application infrastructure and shared contracts.
2. Build background execution, job processing, and event persistence.
3. Develop web discovery, fetching, and structured extraction capabilities.
4. Build the agent execution and orchestration system.
5. Integrate autonomous customer discovery and qualification.
6. Implement personalized email outreach and delivery through Gmail.

These are development goals, not claims that all capabilities are currently available.

## License

All rights reserved. No license has been specified yet.
