# @interviews-tool/infra-db — Package Spec

```
src/
├── client/
├── config/
├── enums/
├── mappers/
├── repositories/
├── schema/
└── utils/
```

---

## `client/`

| Item                        | Kind     | Description                                                |
| --------------------------- | -------- | ---------------------------------------------------------- |
| `db`                        | const    | Pre-configured Drizzle client using `DATABASE_URL` env var |
| `createDatabaseClient(url)` | function | Factory that creates a new Drizzle client from a given URL |

---

## `config/`

| Item                           | Kind  | Description                                         |
| ------------------------------ | ----- | --------------------------------------------------- |
| `INTERVIEWS_TOOL_TABLE_PREFIX` | const | `"interviews_tool"` — prefix for all DB table names |

---

## `enums/`

| Item                      | Kind   | Description                                            |
| ------------------------- | ------ | ------------------------------------------------------ |
| `currencyEnum`            | pgEnum | PostgreSQL enum for currencies (from domain constants) |
| `hiringProcessStatusEnum` | pgEnum | PostgreSQL enum for hiring process statuses            |
| `salaryRateTypeEnum`      | pgEnum | PostgreSQL enum for salary rate types                  |
| `interactionTypeEnum`     | pgEnum | PostgreSQL enum for interaction types                  |

---

## `utils/`

| Item          | Kind     | Description                                                                     |
| ------------- | -------- | ------------------------------------------------------------------------------- |
| `createTable` | function | `pgTableCreator` wrapper that auto-prefixes table names with `interviews_tool_` |
| `timestamps`  | const    | Reusable column object with `createdAt`, `updatedAt`, `deletedAt`               |

---

## `schema/`

### `auth.ts`

| Item                | Kind      | Description                                                      |
| ------------------- | --------- | ---------------------------------------------------------------- |
| `userTable`         | table     | Users (id, name, email, emailVerified, image, timestamps)        |
| `sessionTable`      | table     | Sessions (id, expiresAt, token, ipAddress, userAgent, userId FK) |
| `accountTable`      | table     | OAuth accounts (accountId, providerId, tokens, userId FK)        |
| `verificationTable` | table     | Verification codes (identifier, value, expiresAt)                |
| `userRelations`     | relations | User → many sessions, accounts, interviews                       |
| `sessionRelations`  | relations | Session → one user                                               |
| `accountRelations`  | relations | Account → one user                                               |

### `hiring-process.ts`

| Item                     | Kind      | Description                                                                                                   |
| ------------------------ | --------- | ------------------------------------------------------------------------------------------------------------- |
| `hiringProcessTable`     | table     | Hiring processes (id, companyName, jobTitle, status, salary, currency, salaryRateType, userId FK, timestamps) |
| `hiringProcessRelations` | relations | One user, one companyDetails, many interactions                                                               |
| `HiringProcess`          | type      | Inferred SELECT type                                                                                          |
| `NewHiringProcess`       | type      | Inferred INSERT type                                                                                          |

### `company-details.ts`

| Item                      | Kind      | Description                                                                                    |
| ------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `companyDetailsTable`     | table     | Company details (website, location, benefits, contactInfo, interviewSteps, hiringProcessId FK) |
| `companyDetailsRelations` | relations | One-to-one with hiringProcess                                                                  |
| `CompanyDetails`          | type      | Inferred SELECT type                                                                           |
| `NewCompanyDetails`       | type      | Inferred INSERT type                                                                           |

### `interaction.ts`

| Item                   | Kind      | Description                                                             |
| ---------------------- | --------- | ----------------------------------------------------------------------- |
| `interactionTable`     | table     | Interactions (id, hiringProcessId FK, title, content, type, timestamps) |
| `interactionRelations` | relations | Many-to-one with hiringProcess                                          |
| `Interaction`          | type      | Inferred SELECT type                                                    |
| `NewInteraction`       | type      | Inferred INSERT type                                                    |

### `interview.ts`

| Item                 | Kind      | Description                                                                                     |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `interviewTable`     | table     | Interviews (id, hiringProcessId FK, type, scheduledAt, status, notes) — prepared for future use |
| `interviewRelations` | relations | Many-to-one with hiringProcess                                                                  |
| `Interview`          | type      | Inferred SELECT type                                                                            |
| `NewInterview`       | type      | Inferred INSERT type                                                                            |

---

## `mappers/`

| Item                                        | Kind          | Description                  |
| ------------------------------------------- | ------------- | ---------------------------- |
| `HiringProcessMapper.toDomain(row)`         | static method | DB row → `HiringProcessBase` |
| `HiringProcessMapper.toPersistence(entity)` | static method | `HiringProcessBase` → DB row |
| `InteractionMapper.toDomain(row)`           | static method | DB row → `InteractionBase`   |
| `InteractionMapper.toPersistence(entity)`   | static method | `InteractionBase` → DB row   |

---

## `repositories/`

| Item                                       | Kind   | Description                                                          |
| ------------------------------------------ | ------ | -------------------------------------------------------------------- |
| `HiringProcessRepository`                  | class  | Implements `IHiringProcessRepository`                                |
| `.findById(id, userId)`                    | method | Find by ID + userId, excludes soft-deleted                           |
| `.findPaginated(userId, params, filters?)` | method | Paginated list with status/salary filters, ordered by updatedAt DESC |
| `.save(hiringProcess)`                     | method | Insert new hiring process                                            |
| `.update(id, userId, data)`                | method | Update fields, sets updatedAt, returns updated entity                |
| `.delete(id, userId)`                      | method | Soft delete (sets deletedAt)                                         |
| `InteractionRepository`                    | class  | Implements `IInteractionRepository`                                  |
| `.findById(id, hiringProcessId)`           | method | Find by ID + hiringProcessId, excludes soft-deleted                  |
| `.findByHiringProcessId(hiringProcessId)`  | method | All interactions for a hiring process, ordered by createdAt DESC     |
| `.save(interaction)`                       | method | Insert new interaction                                               |
| `.update(id, data)`                        | method | Update fields, sets updatedAt, returns updated entity                |
| `.delete(id)`                              | method | Soft delete (sets deletedAt)                                         |

---

## Totals

| Category           | Count |
| ------------------ | ----- |
| Files              | 21    |
| Exported classes   | 4     |
| Exported functions | 2     |
| Exported constants | 2     |
| pgEnums            | 4     |
| Drizzle tables     | 7     |
| Exported types     | 13    |
