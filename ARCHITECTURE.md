# Architecture Overview

This document provides a high-level overview of the hiring tool's architecture and links to detailed documentation.

---

## 🎯 Architecture Philosophy

We follow **Domain-Driven Design (DDD)** principles with **Clean Architecture**:

1. **Domain-Centric**: Business logic is isolated from technical concerns
2. **Bounded Contexts**: Each business area has its own model
3. **Dependency Inversion**: Core business logic doesn't depend on infrastructure
4. **Testability**: Architecture enables comprehensive testing at all levels

---

## 📦 Current Structure

```
hiring-tool/
├── apps/
│   ├── web/                  # Frontend (TanStack Start + React)
│   ├── server/               # Backend API (Elysia.js)
│   └── fumadocs/             # Documentation
│
├── packages/
│   ├── domain/               # Business logic (will become hiring/)
│   ├── database/             # Infrastructure (Drizzle + Neon)
│   ├── auth/                 # Authentication (Better Auth)
│   ├── web-ui/               # UI components (shadcn/ui)
│   └── config/               # Shared configuration
```

---

## 🚀 Target Architecture (Future)

```
packages/
├── shared-kernel/            # Generic primitives (Currency, Result, API types)
├── hiring/                   # Hiring bounded context
│   ├── domain/               # Business logic & rules
│   ├── application/          # Use cases & orchestration
│   └── infrastructure/       # Technical implementation
├── analytics/                # Analytics bounded context
├── billing/                  # Billing bounded context
├── integration/              # Context-to-context communication
└── database/                 # Shared database schemas
```

---

## 📚 Documentation

### 🌟 Start Here

1. **[Bounded Contexts - Complete Guide](./apps/fumadocs/content/docs/architecture/bounded-contexts-complete-guide.mdx)**
   - Comprehensive guide covering full architecture
   - Package structure per context
   - All layers (Domain, Application, Infrastructure)
   - Context integration patterns
   - Real-world examples

### Core Patterns

2. **[Repository Pattern](./apps/fumadocs/content/docs/architecture/repository-pattern.mdx)**
   - Interface in domain, implementation in infrastructure
   - Mapper pattern for DB ↔ Domain conversion
   - Complete implementation examples

3. **[Application Services Layer](./apps/fumadocs/content/docs/architecture/application-services-layer.mdx)**
   - CQRS pattern (Commands vs Queries)
   - Use Case handlers
   - DTOs and mappers

4. **[Shared Kernel & Bounded Contexts](./apps/fumadocs/content/docs/architecture/shared-kernel-and-bounded-contexts.mdx)**
   - What to share vs what to keep context-specific
   - Decision framework
   - Package naming conventions

### Implementation Guides

5. **[Shared Kernel Implementation Guide](./apps/fumadocs/content/docs/architecture/shared-kernel-implementation-guide.mdx)**
   - Step-by-step extraction of shared primitives
   - Complete bash commands
   - File-by-file migration

6. **[Repository Refactoring Summary](./apps/fumadocs/content/docs/architecture/repository-refactoring-summary.mdx)**
   - Summary of completed refactoring work
   - Before/after comparison
   - Migration guide for other features

### Authentication

7. **[Authentication Architecture](./apps/fumadocs/content/docs/authentication/overview.mdx)**
   - Full-stack auth implementation
   - Server-side session validation
   - Proxy pattern for cookies
   - Better Auth + TanStack Start

---

## 🏛️ Architecture Layers

### Domain Layer

**Location:** `packages/[context]/domain/`

**Contains:**

- Entities with business behavior
- Value Objects with invariants
- Repository interfaces
- Domain Services
- Domain Events

**Dependencies:** Only shared-kernel

---

### Application Layer

**Location:** `packages/[context]/application/`

**Contains:**

- Use Case handlers (Commands/Queries)
- Application Services
- DTOs
- Input validation
- Transaction orchestration

**Dependencies:** Domain layer + shared-kernel

---

### Infrastructure Layer

**Location:** `packages/[context]/infrastructure/` or `packages/database/`

**Contains:**

- Repository implementations
- Database access (Drizzle ORM)
- External API clients
- File system operations
- Event publishers

**Dependencies:** Domain layer + Application layer + shared-kernel

---

## 🎯 Key Principles

### 1. Dependency Rule

```
Infrastructure → Application → Domain → Shared Kernel
```

**✅ Allowed:**

- Application uses Domain
- Infrastructure implements Domain interfaces
- All layers use Shared Kernel

**❌ Forbidden:**

- Domain uses Application
- Domain uses Infrastructure
- Context A directly uses Context B

---

### 2. Bounded Context Independence

Each context:

- Has its own domain model
- Has its own database tables (or projections)
- Can evolve independently
- Communicates via published APIs or events

---

### 3. Shared Kernel Restrictions

Shared Kernel contains ONLY:

- Generic primitives (Currency, Result)
- API contracts (ApiResponse, Pagination)
- TypeScript utilities
- NO business logic
- NO context-specific code

---

## 🔧 Technology Stack

| Layer          | Technology                     |
| -------------- | ------------------------------ |
| **Frontend**   | TanStack Start, React, Vite    |
| **Backend**    | Elysia.js, Bun                 |
| **Database**   | Neon (PostgreSQL), Drizzle ORM |
| **Auth**       | Better Auth                    |
| **UI**         | shadcn/ui, Tailwind CSS        |
| **Deployment** | Cloudflare Workers             |
| **Monorepo**   | Bun Workspaces                 |
| **Docs**       | Fumadocs                       |

---

## 📖 Domain-Driven Design Patterns Used

- **Entities**: Objects with identity and lifecycle
- **Value Objects**: Immutable objects defined by their values
- **Aggregates**: Clusters of entities with consistency boundaries
- **Repositories**: Abstraction for data access
- **Domain Services**: Stateless operations on domain objects
- **Domain Events**: Things that happened in the domain
- **Application Services**: Use case orchestration
- **DTOs**: Data transfer between layers
- **Bounded Contexts**: Logical boundaries for models
- **Shared Kernel**: Small set of shared primitives
- **Published Language**: Public APIs between contexts
- **Anti-Corruption Layer**: Protect from external models

---

## 🚦 Current Status

### ✅ Implemented

- Repository pattern with interfaces and implementations
- Mapper pattern for DB ↔ Domain conversion
- Clean separation of concerns
- Server-side pagination
- Full-stack authentication
- Comprehensive documentation

### 📋 Planned

- Extract shared kernel package
- Add Application Services layer
- Implement CQRS pattern
- Add domain events
- Create integration package for context APIs
- Add analytics bounded context
- Add billing bounded context

---

## 🧪 Testing Strategy

### Unit Tests

- Domain entities and value objects
- Domain services
- Application service handlers
- Mappers

### Integration Tests

- Repository implementations
- API endpoints
- Authentication flows

### E2E Tests

- Full user workflows
- Cross-context integration

---

## 📈 Evolution Path

### Phase 1: Current (Single Context)

- `packages/domain/` - All business logic
- `packages/database/` - All infrastructure

### Phase 2: Shared Kernel

- Extract `packages/shared-kernel/`
- Move generic primitives

### Phase 3: Application Layer

- Add `packages/domain/application/`
- Implement use cases and DTOs

### Phase 4: Rename to Hiring Context

- Rename `packages/domain/` → `packages/hiring/`
- Clear bounded context boundary

### Phase 5: Multiple Contexts

- Add `packages/analytics/`
- Add `packages/billing/`
- Add `packages/integration/`

---

## 🔗 Quick Links

### Documentation

- 📘 [Full Architecture Docs](./apps/fumadocs/content/docs/architecture/)
- 🔐 [Authentication Docs](./apps/fumadocs/content/docs/authentication/)
- 💾 [Backend Docs](./apps/fumadocs/content/docs/backend/)

### Architecture Discussion

- 📂 [Architecture Discussion Folder](/Users/cristiansotomayor/Documents/Workspace/Personal/Niway/architecture-discussion/)
- 📋 [Repository Pattern Theory](./architecture-discussion/05-repository.md)
- 📋 [Application Services Theory](./architecture-discussion/06-application-service.md)
- 📋 [Bounded Contexts Theory](./architecture-discussion/08-bounded-context.md)

### Code Examples

- 🏗️ [Repository Implementation](./packages/db/src/repositories/)
- 🗺️ [Mappers](./packages/db/src/mappers/)
- 🎯 [Domain Models](./packages/domain/src/)

---

## 💡 Key Takeaways

1. **Domain First**: Business logic is protected and independent
2. **Repository Pattern**: Clean abstraction for data access
3. **Bounded Contexts**: Each business area has its own model
4. **Shared Kernel**: Small, stable, generic primitives
5. **Clean Architecture**: Dependencies flow inward toward domain
6. **Testability**: Architecture enables comprehensive testing
7. **Evolution**: Start simple, refactor as complexity grows

---

## 🤝 Contributing

When adding new features:

1. **Start with Domain**: Define entities, value objects, and business rules
2. **Add Repository Interface**: Define data access needs in domain
3. **Implement Repository**: Create infrastructure implementation
4. **Add Use Cases**: Create application services for orchestration
5. **Wire Infrastructure**: Connect everything in HTTP routes
6. **Test**: Unit tests for domain, integration tests for repositories
7. **Document**: Update architecture docs if patterns change

---

_For questions or clarification, see the detailed documentation in `apps/fumadocs/content/docs/architecture/`_
