# Hiring Tool - Architecture Context Document

## 1. Project Overview

A hiring process tracker built as a monorepo with web, mobile, and API applications sharing domain logic.

**Tech Stack:** TypeScript, React 19, React Native (Expo), Elysia (Cloudflare Workers), Drizzle ORM, Neon PostgreSQL, better-auth, Zod, TanStack (Router/Query/Form/Start).

---

## 2. Current Package Structure

```
hiring-tool/
├── apps/
│   ├── server/          # Elysia API on Cloudflare Workers
│   ├── web/             # TanStack Start (React 19) web app
│   ├── mobile/          # Expo (React Native) mobile app
│   └── fumadocs/        # Documentation site (Next.js)
│
├── packages/
│   ├── domain/          # Pure business logic: constants, schemas, types, repository interfaces
│   ├── application/     # Use cases (orchestration, no I/O of its own)
│   ├── db/              # Infrastructure: Drizzle schemas, repositories, mappers, client
│   ├── auth/            # better-auth config (base config, password hashing, session)
│   ├── web-ui/          # Reusable React UI components (Tailwind, Base UI)
│   └── config/          # Shared config (placeholder, minimal)
```

---

## 3. Dependency Graph

```
                   ┌──────────────┐
                   │    domain    │  ← LEAF NODE (no deps)
                   │  constants   │
                   │  schemas     │
                   │  types       │
                   │  repo ifaces │
                   └──────┬───────┘
                          │
              ┌───────────┼───────────┐
              ▼                       ▼
       ┌──────────────┐       ┌──────────────┐
       │  application  │       │     db       │
       │  (use cases)  │       │  (infra)     │
       │               │       │  schemas     │
       │  imports ONLY │       │  repos impl  │
       │  from domain  │       │  mappers     │
       └──────┬────────┘       └──────┬───────┘
              │                       │
              └───────────┬───────────┘
                          ▼
                   ┌──────────────┐
                   │    server    │  wires everything together
                   │  (Elysia)   │  domain + application + db + auth
                   └──────┬───────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
         ┌────────┐ ┌──────────┐ ┌──────────┐
         │  web   │ │  mobile  │ │ fumadocs │
         └────────┘ └──────────┘ └──────────┘

Mobile can ONLY import from: domain (constants, schemas, types)
Mobile must NEVER import from: db, application, auth, server
```

**Rule:** The dependency arrow is always `infrastructure → application → domain`. Domain stays leaf-level so importing it can never transitively pull in server code.

---

## 4. What Lives Where Today

### 4.1 `packages/domain/` — Pure, zero infrastructure deps

| Folder          | Contents                                                                       | Example                                                |
| --------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `constants/`    | Enums, status values, labels, transitions, metadata (now includes `color` hex) | `HIRING_PROCESS_STATUSES`, `INTERACTION_TYPE_LABELS`   |
| `schemas/`      | Zod validation schemas: Base, Create, Update, Filter                           | `createHiringProcessSchema`, `hiringProcessBaseSchema` |
| `types/`        | Generic utility types                                                          | `Result<T,E>`, `ApiResponse<T>`, `ObjectProperties<T>` |
| `repositories/` | Interfaces only (contracts)                                                    | `IHiringProcessRepository`                             |

**Exports via subpath:**

```
@interviews-tool/domain/constants
@interviews-tool/domain/schemas
@interviews-tool/domain/types
@interviews-tool/domain/repositories
```

### 4.2 `packages/application/` — Use cases

| File                              | Purpose                                                              |
| --------------------------------- | -------------------------------------------------------------------- |
| `hiring/create-hiring-process.ts` | Orchestrates creation: validates, sets defaults, calls `repo.save()` |

**Pattern — Dependency injection:**

```typescript
export async function createHiringProcess(params: {
  repo: IHiringProcessRepository;  // injected by caller
  input: CreateHiringProcess;
  userId: string;
}): Promise<Result<HiringProcessBase>>
```

Application imports ONLY from domain. The caller (server) wires the concrete repository.

### 4.3 `packages/db/` — Infrastructure

| Folder          | Contents                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------- |
| `client/`       | Neon HTTP client + Drizzle setup                                                                   |
| `schema/`       | Drizzle table definitions: `hiring-process`, `interaction`, `company-details`, `interview`, `auth` |
| `enums/`        | `pgEnum` mappings from domain constants                                                            |
| `repositories/` | Concrete implementations of domain interfaces                                                      |
| `mappers/`      | `toDomain()` / `toPersistence()` transformations                                                   |
| `utils/`        | Table creator (prefix), reusable timestamp columns                                                 |
| `config/`       | `INTERVIEWS_TOOL_TABLE_PREFIX`                                                                     |

### 4.4 `packages/auth/` — Authentication

| File                    | Purpose                                                                    |
| ----------------------- | -------------------------------------------------------------------------- |
| `config/base-config.ts` | BetterAuthOptions: Drizzle adapter, scrypt password hashing, cookie config |
| `config/functions.ts`   | Custom session plugin (placeholder)                                        |

### 4.5 `apps/server/` — API (Elysia + Cloudflare Workers)

| Folder        | Contents                                                              |
| ------------- | --------------------------------------------------------------------- |
| `routes/`     | REST endpoints: `hiring-processes`, `interactions`, `company-details` |
| `plugins/`    | `authMacro` — Elysia decorator for route auth                         |
| `utils/`      | Error classes, error handlers, response helpers                       |
| `lib/auth.ts` | better-auth instance with expo plugin, trustedOrigins                 |

**Wiring pattern:**

```typescript
new Elysia()
  .decorate("db", createDatabaseClient(...))
  .derive(({ db }) => ({ hiringProcessRepo: new HiringProcessRepository(db) }))
  .use(authMacro)
  // Routes receive repo via context
```

### 4.6 `apps/web/` — Web App (TanStack Start)

| Folder        | Contents                                                           |
| ------------- | ------------------------------------------------------------------ |
| `functions/`  | TanStack Start `serverFn` — runs on server, no HTTP hop            |
| `hooks/`      | React Query hooks: `useHiringProcesses`, `useInteractions`, etc.   |
| `components/` | UI: `status-badge`, `hiring-process-table`, `interaction-timeline` |
| `routes/`     | File-based routing with auth guards                                |
| `lib/`        | Eden Treaty client (type-safe RPC to Elysia), auth client          |

### 4.7 `apps/mobile/` — Mobile App (Expo)

| Folder        | Contents                                                        |
| ------------- | --------------------------------------------------------------- |
| `app/(auth)/` | Sign-in, sign-up screens                                        |
| `app/(tabs)/` | Bottom tab navigation: Home (list), Stats, Profile              |
| `app/hiring/` | Detail `[id].tsx`, create `create.tsx`                          |
| `lib/`        | `api-client.ts` (fetch + better-auth cookies), `auth-client.ts` |
| `hooks/`      | `useHiringProcesses` (infinite query)                           |

---

## 5. Database Schema

```
user (better-auth) ──1:N── session
                    ──1:N── account
                    ──1:N── hiring_process ──1:1── company_details
                                           ──1:N── interaction
                                           ──1:N── interview (future)
```

**Tables** (prefixed `interviews_tool_`):

- `hiring_process`: id, userId, companyName, jobTitle, status (enum), salary, currency, salaryRateType, timestamps, deletedAt (soft delete)
- `company_details`: id, hiringProcessId (unique FK), website, location, benefits, contactedVia, contactPerson, interviewSteps
- `interaction`: id, hiringProcessId, title, content, type (enum), timestamps, deletedAt
- `interview`: id, hiringProcessId, type, scheduledAt, status, notes, timestamps (not yet used)

---

## 6. Data Flow Example: Creating a Hiring Process

```
Mobile/Web
  → POST /api/v1/hiring-processes { companyName, jobTitle, ... }

Server (Elysia route handler)
  → Validates body with createHiringProcessSchema (from domain)
  → authMacro checks session
  → Calls createHiringProcess({ repo, input, userId }) (from application)

Application (use case)
  → Sets defaults: currency=USD, salaryRateType=monthly, status=first-contact
  → Generates ID (crypto.randomUUID)
  → Calls repo.save(hiringProcess)
  → Returns Result<HiringProcessBase>

Infrastructure (repository)
  → HiringProcessMapper.toPersistence(entity)
  → db.insert(hiringProcessTable).values(persistence)
  → Returns mapped domain entity

Response
  → HTTP 201 { data: HiringProcessBase }
```

---

## 7. Architectural Patterns in Use

| Pattern                      | Where                          | How                                                                      |
| ---------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| **Repository pattern**       | domain (interface) → db (impl) | `IHiringProcessRepository` / `HiringProcessRepository`                   |
| **Data Mapper**              | db/mappers/                    | `toDomain()` / `toPersistence()` — decouples DB schema from domain model |
| **Result type**              | domain/types                   | `Result<T,E>` — Rust-style, no exceptions for business errors            |
| **Dependency injection**     | application use cases          | Caller passes `repo` instance, use case doesn't know about DB            |
| **Schema-driven validation** | domain/schemas                 | Zod schemas shared between server validation and client forms            |
| **Subpath exports**          | all packages                   | `@pkg/domain/constants`, `@pkg/domain/schemas`, etc.                     |
| **Soft delete**              | db schema                      | `deletedAt` column, queries filter `isNull(deletedAt)`                   |

---

## 8. Open Architecture Questions

### 8.1 DTOs / Data Mappers — Application or Domain?

**Current state:** Data mappers live in `packages/db/src/mappers/`. They transform between Drizzle row types and domain `HiringProcessBase` (a Zod-inferred type from domain schemas).

**The question:** If we formalize DTOs (Data Transfer Objects) — e.g., a response shape that's different from the domain entity — where should they live?

**Considerations:**

- **Domain** already defines the "canonical shape" via Zod schemas (`HiringProcessBase`). This is what gets returned in API responses today.
- **Data Mappers** (DB row ↔ domain entity) are infrastructure concerns — they depend on Drizzle types. They belong in `db/`.
- **DTOs** (domain entity ↔ API response) would be an application/presentation concern. If a DTO exists to reshape data for a specific consumer (e.g., mobile gets fewer fields), it could live in `application/` since it's about use-case-specific output formatting.
- If a DTO is just "the domain entity serialized" (which is the current case — `HiringProcessBase` IS the API response), no separate DTO is needed.

### 8.2 What Else Could Live in `application/hiring/` Besides Use Cases?

**Candidates:**

- **Use cases** (already there): `createHiringProcess`, future: `updateHiringProcess`, `deleteHiringProcess`, `changeStatus`
- **Application services**: Cross-cutting orchestration (e.g., "create hiring process AND send notification")
- **DTOs / Response mappers**: If you need to transform domain entities for specific consumers
- **Application-level validation**: Business rules that span multiple entities (e.g., "can't have more than 50 active processes")
- **Event handlers**: If you add domain events (e.g., "on status change, log interaction")

**NOT candidates** (these belong elsewhere):

- Constants, enums → domain
- Zod schemas → domain
- Repository implementations → db
- HTTP concerns → server routes

### 8.3 Proposed Bounded Context Structure

**Your idea:**

```
domain/
  hiring/
    constants/
    schemas/
    entities/
    repositories/
  interviews/
    constants/
    schemas/
    ...

application/
  hiring/
    use-cases/
  interviews/
    use-cases/
```

**With barrel exports by type (cross-cutting):**

```typescript
// domain/constants.ts (or domain/src/constants/index.ts)
export * from "./hiring/constants";
export * from "./interviews/constants";

// domain/schemas.ts
export * from "./hiring/schemas";
export * from "./interviews/schemas";
```

**Import ergonomics:**

```typescript
// Option A: Import by type (your barrel approach)
import { HIRING_PROCESS_STATUSES, INTERVIEW_STATUSES } from "@pkg/domain/constants";
import { createHiringProcessSchema } from "@pkg/domain/schemas";

// Option B: Import by bounded context
import { HIRING_PROCESS_STATUSES } from "@pkg/domain/hiring/constants";
import { createHiringProcessSchema } from "@pkg/domain/hiring/schemas";
```

**Trade-offs:**

|                        | Option A: Barrel by type                                                          | Option B: By bounded context                    |
| ---------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Ergonomics**         | Fewer import paths to remember                                                    | More explicit about where things come from      |
| **Tree-shaking**       | Barrel re-exports can defeat tree-shaking (bundler imports entire `constants.ts`) | Granular imports, better tree-shaking           |
| **Name collisions**    | Risk if two domains export same name (e.g., both have `STATUS_VALUES`)            | No collision risk — path disambiguates          |
| **Discoverability**    | Easy — one import path for all constants                                          | Need to know which domain owns what             |
| **Refactoring**        | Move a constant between domains → barrel handles it, consumers don't change       | Move a constant → consumers must update imports |
| **Mobile bundle size** | Could pull in constants from all domains even if only using one                   | Only pulls in what's imported                   |

**For this project today** (single bounded context: hiring), Option A works fine. The barrel files are just re-exporting from one domain anyway. When you add a second bounded context, Option B may be worth considering for tree-shaking on mobile.

---

## 9. Current Bounded Contexts

Today there's effectively **one bounded context: Hiring**.

**Entities:** HiringProcess, Interaction, CompanyDetails, Interview (future)

**Potential future bounded contexts:**

- **Interviews** (scheduling, types, feedback) — currently a table but no logic
- **Notifications** (email, push) — doesn't exist yet
- **Analytics** (stats, reports) — the mobile app has a Stats tab placeholder

---

## 10. Key Files Reference

| Purpose                              | Path                                                            |
| ------------------------------------ | --------------------------------------------------------------- |
| Status constants + transitions       | `packages/domain/src/constants/hiring-process-status.ts`        |
| Zod schemas (create, update, filter) | `packages/domain/src/schemas/hiring-process.ts`                 |
| Repository interface                 | `packages/domain/src/repositories/hiring-process.repository.ts` |
| Result type                          | `packages/domain/src/types/result.ts`                           |
| Create use case                      | `packages/application/src/hiring/create-hiring-process.ts`      |
| DB table definition                  | `packages/db/src/schema/hiring-process.ts`                      |
| Repository implementation            | `packages/db/src/repositories/hiring-process.repository.ts`     |
| Data mapper                          | `packages/db/src/mappers/hiring-process.mapper.ts`              |
| Auth base config                     | `packages/auth/src/config/base-config.ts`                       |
| Server auth (expo + trustedOrigins)  | `apps/server/src/lib/auth.ts`                                   |
| Server routes                        | `apps/server/src/routes/hiring-processes.ts`                    |
| Web status badge                     | `apps/web/src/components/hiring-process/status-badge.tsx`       |
| Web hooks                            | `apps/web/src/hooks/use-hiring-processes.ts`                    |
| Mobile home screen                   | `apps/mobile/app/(tabs)/index.tsx`                              |
| Mobile API client                    | `apps/mobile/lib/api-client.ts`                                 |
| Mobile auth client                   | `apps/mobile/lib/auth-client.ts`                                |
