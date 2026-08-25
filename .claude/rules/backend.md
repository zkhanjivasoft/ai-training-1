---
paths:
  - 'server/**'
  - 'shared/src/**/*.ts'
  - 'scripts/**/*.mjs'
  - 'docs/**/*.md'
  - 'package.json'
  - 'eslint.config.js'
  - '.github/workflows/*.yml'
---

```hypr-meta
domain: backend
base_commit: dc608e0d0ddde95c779e1bc7c4acb744a3747daf
generated_at: 2026-08-24
plugin_version: 1.1.0
next_id: 68
```

```rule
id: BE-001
severity: warn
scope: server/src/routes/*.routes.ts
statement: Return `201` from resource-creating POST handlers by passing the third `sendData` option — `sendData(res, service.create(input), { status: 201 })`; all other handlers omit the option and rely on the default `200`.
example: server/src/routes/lists.routes.ts:19
check:
```

```rule
id: BE-002
severity: error
scope: server/src/routes/*.routes.ts
statement: DELETE handlers respond `200` with the literal body `sendData(res, { deleted: true })` after the service call — this project never returns `204` or echoes the deleted entity.
example: server/src/routes/todos.routes.ts:39
check:
```

```rule
id: BE-003
severity: warn
scope: server/src/routes/*.routes.ts
statement: Expose state transitions that are not plain CRUD as `POST /:id/<verb>` sub-routes delegating to a same-named service method with no request body (e.g. `todosRouter.post('/:id/complete', …)` → `todosService.complete(id)`); do not model them as PATCH field writes.
example: server/src/routes/todos.routes.ts:29
check:
```

```rule
id: BE-004
severity: warn
scope: server/src/routes/*.routes.ts
statement: For paginated collections, destructure the service's `{ items, meta }` result and pass the meta through `sendData`'s options (`sendData(res, todos, { meta })`) — the route never computes `total`, `page`, or `pageSize` itself.
example: server/src/routes/todos.routes.ts:11
check:
```

```rule
id: BE-005
severity: error
scope: server/src/routes/*.routes.ts
statement: Route handlers must not import from `server/src/repositories/` or `server/src/db/store.ts`, and must not inspect the returned entity to decide a status or shape — the route's only job is validate, delegate, respond.
example: server/src/routes/tags.routes.ts:22
check:
```

```rule
id: BE-006
severity: warn
scope: server/src/routes/*.routes.ts
statement: Keep a route handler to at most three statements — `parseWith(schema, req.body|req.query)`, one service call, one `sendData` — with zero business logic in between.
example: server/src/routes/tags.routes.ts:22
check:
```

```rule
id: BE-007
severity: warn
scope: server/src/services/*.service.ts
statement: Export each service as a single named object literal using method shorthand — `export const tagsService = { list() {...}, getById(id) {...} }` — in `server/src/services/<resource>.service.ts`; no classes, no `default` export, no loose exported functions (module-level helpers stay unexported).
example: server/src/services/tags.service.ts:8
check:
```

```rule
id: BE-008
severity: warn
scope: server/src/services/*.service.ts
statement: Give every service method an explicit return type drawn from `@taskboard/shared` (`Tag`, `Todo[]`, `StatsSummary`, `{ todos: Todo[]; meta: PageMeta }`) and accept already-validated plain inputs — services never touch `req`, `res`, or zod schemas.
example: server/src/services/todos.service.ts:40
check:
```

```rule
id: BE-009
severity: error
scope: server/src/services/*.service.ts
statement: Enforce cross-entity constraints in the service before writing — a duplicate name or an in-use referenced entity throws `ConflictError`, a bad field combination throws `ValidationError`; a route never performs such a check.
example: server/src/services/tags.service.ts:44
check:
```

```rule
id: BE-010
severity: error
scope: server/src/services/*.service.ts
statement: The service layer is the only layer that records activity: after each successful todo mutation call `activityService.record(entity, '<action>')` with the repository's returned entity, using the action verbs `created`/`updated`/`completed`/`reopened`/`deleted`.
example: server/src/services/todos.service.ts:87
check:
```

```rule
id: BE-011
severity: error
scope: server/src/services/*.service.ts
statement: Services mint entity ids by calling `newId('<prefix>')` from `server/src/lib/ids.ts` (producing e.g. `tag_9f2c1a7b`) and pass the finished id to the repository — a repository never generates an id, and `crypto.randomUUID()` is never called outside `lib/ids.ts`.
example: server/src/services/tags.service.ts:24
check:
```

```rule
id: BE-012
severity: error
scope: server/src/services/*.service.ts
statement: Services own timestamps: assign `createdAt`/`updatedAt` as ISO strings with `new Date().toISOString()` before calling the repository, reusing a single `const now` when a mutation sets more than one, and use `.toISOString().slice(0, 10)` for date-only values. A repository never stamps a timestamp.
example: server/src/services/todos.service.ts:83
check:
```

```rule
id: BE-013
severity: warn
scope: server/src/services/*.service.ts
statement: Services never call `fetch` or any third-party transport directly — the HTTP call lives in `server/src/clients/<name>Client.ts` and the service awaits it (`inspirationService.getQuote` is the reference).
example: server/src/services/inspiration.service.ts:12
check:
```

```rule
id: BE-014
severity: error
scope: server/src/**/*.ts
statement: Only modules under `server/src/repositories/` may import `server/src/db/store.ts` and its `readDb`/`writeDb` helpers — routes, services, and lib modules must go through a `<resource>Repository`. The single exception is `server/src/index.ts`, which calls `ensureDb()` once at boot; `server/src/testing/helpers.ts` may import the `Db` type only.
example: server/src/db/store.ts:13
check:
```

```rule
id: BE-015
severity: warn
scope: server/src/repositories/*.repository.ts
statement: A repository is a single named-export object literal called `<resource>Repository` (e.g. `export const tagsRepository = { ... }`) whose methods are plain synchronous functions — no classes, no `async`, no Promise returns, since `readDb`/`writeDb` are sync `fs` calls.
example: server/src/repositories/tags.repository.ts:5
check:
```

```rule
id: BE-016
severity: warn
scope: server/src/repositories/*.repository.ts
statement: Name repository methods from the fixed vocabulary `findAll`, `findById`, `insert`, `update`, `remove`, and `findBy<Field>` for foreign-key lookups (see `activityRepository.findByTodoId`) — no `get*`, `save*`, `create*`, or `delete*` variants.
example: server/src/repositories/activity.repository.ts:9
check:
```

```rule
id: BE-017
severity: error
scope: server/src/repositories/*.repository.ts
statement: Every mutation is a self-contained read-modify-write inside one repository method: `const db = readDb()`, mutate `db.<collection>` (push for insert, `Object.assign(found, changes)` for update, reassign a `filter()`ed array for remove), then `writeDb(db)` with that same object. `writeDb` rewrites the whole file, so never cache a `Db` across calls, never pass a `Db` in or out of a method, and never call `writeDb` more than once per method.
example: server/src/repositories/tags.repository.ts:21
check:
```

```rule
id: BE-018
severity: error
scope: server/src/repositories/*.repository.ts
statement: Repositories signal a missing record by return value and never throw — `findById`/`update` return `undefined`, `remove` returns `false` when nothing matched (compare collection length before and after the filter). Typed errors like `NotFoundError` belong to the service, which relies on this contract (e.g. `tagsRepository.update(id, changes)!` after its own `getById`).
example: server/src/repositories/tags.repository.ts:24
check:
```

```rule
id: BE-019
severity: warn
scope: server/src/services/*.service.ts
statement: Filtering, sorting, and pagination are in-memory service work over the whole collection from `findAll()`: chain `.filter()` per query param, order with `.toSorted()` (never in-place `.sort()`), then `.slice(start, start + pageSize)`. Do not add query/sort/limit parameters to repository methods.
example: server/src/services/todos.service.ts:44
check:
```

```rule
id: BE-020
severity: error
scope: server/src/db/store.ts
statement: There is no migration system — the schema IS the `Db` interface in server/src/db/store.ts. Adding or renaming a collection means editing that interface, defining the entity type in shared/src, and updating the `FIXTURE` in server/src/testing/helpers.ts in the same change, so tests and the `Db` type stay in sync.
example: server/src/db/store.ts:6
check:
```

```rule
id: BE-021
severity: error
scope: server/src/middleware/errorHandler.ts
statement: Errors that are not `AppError` subclasses must respond with exactly `sendError(res, 500, 'INTERNAL', 'An unexpected error occurred')` — the real message, stack, or thrown value goes only to `logger.error`, never into the response body. Do not widen the 500 envelope with the caught message or `details`.
example: server/src/middleware/errorHandler.ts:26
check:
```

```rule
id: BE-022
severity: warn
scope: server/src/app.ts
statement: This app has no authentication, authorization, session, CORS, or helmet layer by design and every endpoint is public — do not add auth middleware, route guards, roles, or a user entity, and do not write code that assumes a `req.user`. If a feature genuinely needs identity, add an ADR under `docs/adr/` first.
example: server/src/app.ts:8
check:
```

```rule
id: BE-023
severity: error
scope: server/data/seed.json
statement: Never write `server/data/seed.json`; it is the canonical reset baseline, guarded by a `permissions.deny` rule in `.claude/settings.json` plus the `.claude/hooks/protect-seed.js` PreToolUse hook, which exits 2 on any Edit/Write targeting it. Change data through the API or the generated `server/data/db.json`, then run `npm run reset-db` (`scripts/reset-db.mjs`); `readDb()` auto-creates `db.json` from the seed when absent, and done means `seed.json` has no diff.
example: .claude/hooks/protect-seed.js:23
check:
```

```rule
id: BE-024
severity: warn
scope: server/src/services/*.service.ts
statement: Log an upstream rate limit at `logger.warn('<file-basename>', …, { retryAfterSeconds })` and any other provider failure at `logger.error('<file-basename>', …, { status })` immediately before throwing the typed error, so the provider's status survives in the logs even though it is stripped from the response.
example: server/src/services/inspiration.service.ts:21
check:
```

```rule
id: BE-025
severity: warn
scope: server/src/routes/**/*.routes.ts
statement: Routes never set the `Retry-After` header (or any status/header for a failure) — throw `RateLimitedError` and let `errorHandler` derive `Retry-After` from `err.retryAfterSeconds`. That mapping lives in one place; duplicating it in a route breaks the single-envelope contract.
example: server/src/routes/inspiration.routes.ts:13
check:
```

```rule
id: BE-026
severity: error
scope: server/src/routes/*.routes.ts
statement: Validate every request body and query string in the route with `parseWith(schema, req.body)` / `parseWith(schema, req.query)` from `server/src/lib/validate.ts` and pass the returned value to the service — `parseWith` is the single place a zod failure becomes a 400 `VALIDATION_ERROR` with field `details`. Never call `schema.parse`/`schema.safeParse` in a route, never read raw `req.body`/`req.query` fields, and never validate inside a service (path params like `req.params.id` pass through unvalidated).
example: server/src/routes/tags.routes.ts:18
check:
```

```rule
id: BE-027
severity: warn
scope: server/src/schemas/*.schema.ts
statement: Put a resource's body schemas in `server/src/schemas/<resource>.schema.ts` as named zod exports `create<Entity>Schema` and `update<Entity>Schema`, deriving the update schema from the create one with `.partial()` unless individual fields need nullable/optional differences (as in `todos.schema.ts`).
example: server/src/schemas/tags.schema.ts:8
check:
```

```rule
id: BE-028
severity: info
scope: server/src/routes/*.routes.ts
statement: One-off query schemas for read-only endpoints stay inline in the route file rather than getting a `schemas/` module of their own (see `activity.routes.ts`).
example: server/src/routes/activity.routes.ts:8
check:
```

```rule
id: BE-029
severity: error
scope: server/src/schemas/*.schema.ts
statement: Query-string schemas must coerce and default numeric params — `z.coerce.number().int().min(1).default(n)` with an upper `.max()` for page sizes/limits — and give every optional filter a `.default()` where the service assumes a value, so services receive fully-resolved values (`todosService.list` types `sort`/`page`/`pageSize` as Required).
example: server/src/schemas/todos.schema.ts:30
check:
```

```rule
id: BE-030
severity: warn
scope: server/src/schemas/*.schema.ts
statement: Free-text string fields are declared `z.string().trim()` with explicit `.min(1)` and a `.max(n)` bound (name 30, list name 50, todo title 120, notes 1000); formatted fields use `.regex(..., 'must be …')` with a human-readable message, and shared formats are hoisted to a module-level const such as `isoDate`.
example: server/src/schemas/tags.schema.ts:4
check:
```

```rule
id: BE-031
severity: error
scope: server/src/services/*.service.ts
statement: Cross-entity reference checks are NOT expressed in zod — validate that referenced ids exist inside the service and throw `ValidationError(\`listId '<id>' does not exist\`)`, following the `assertReferences` helper that `todosService.create`/`update` call as their first statement.
example: server/src/services/todos.service.ts:28
check:
```

```rule
id: BE-032
severity: error
scope: server/src/services/*.service.ts
statement: Signal expected failures by throwing an existing typed class from `server/src/lib/errors.ts` (`NotFoundError(resource, id)` with a capitalized singular resource name, `ValidationError`, `ConflictError`, `RateLimitedError`, `UpstreamError`); never return null/undefined/error tuples for a failure, never touch `res`, and never construct a bare `AppError` or `Error` with an ad-hoc code — a new code requires adding it to the `ApiErrorCode` union in `shared/src/types.ts` plus a subclass here.
example: server/src/services/tags.service.ts:15
check:
```

```rule
id: BE-033
severity: error
scope: server/src/services/*.service.ts
statement: Every mutating service method (`update`, `remove`, `complete`, `reopen`) starts with `this.getById(id)` so the 404 is raised before any repository write; this is what licenses the non-null assertion on `repository.update(id, changes)!` — do not re-implement the existence check or drop the guard.
example: server/src/services/tags.service.ts:31
check:
```

```rule
id: BE-034
severity: error
scope: server/src/routes/*.routes.ts
statement: Produce success bodies only with `sendData(res, payload)` from `server/src/lib/respond.ts` — `{ status: 201 }` for POST creates, `{ meta }` for paginated lists, and `sendData(res, { deleted: true })` for DELETE. Never call `res.json`, `res.send`, or `res.status(...).json` in a route, never hand-build the `{ data, meta? }` envelope, and never build an error body in a route (the error middleware owns `sendError`).
example: server/src/routes/tags.routes.ts:19
check:
```

```rule
id: BE-035
severity: error
scope: server/src/routes/*.routes.ts
statement: Route handlers contain no try/catch and no asyncHandler-style wrapper — Express 5 forwards rejected async handlers to `errorHandler`, which is registered last in `createApp()`; an async handler responds inline as `sendData(res, await service.x())`.
example: server/src/routes/inspiration.routes.ts:13
check:
```

```rule
id: BE-036
severity: error
scope: server/src/services/*.service.ts
statement: When wrapping an external client, catch the client's own error type (e.g. `UpstreamHttpError` from `server/src/clients/`) in the service and translate its status onto our typed errors — 404 -> `NotFoundError`, 429 -> `RateLimitedError(message, err.retryAfterSeconds ?? 30)`, any other status -> `UpstreamError` after a `logger.error`, and `throw err` unchanged for anything not of that type. We author the user-facing message; never let a raw client error reach the error middleware and never surface a provider fault as a bare 500.
example: server/src/services/inspiration.service.ts:20
check:
```

```rule
id: BE-037
severity: error
scope: server/src/routes/*.ts
statement: Routes never import from `server/src/clients/` — only a service may import a client wrapper (e.g. `inspiration.service.ts` imports `fetchQuote`/`UpstreamHttpError` from `../clients/inspirationClient`); an async route calls the service, never the client.
example: server/src/routes/inspiration.routes.ts:15
check:
```

```rule
id: BE-038
severity: warn
scope: server/src/**/*.ts
statement: Only the upstream-calling path (`clients/`, its wrapping service, and that service's route handler) is `async`; the JSON-file persistence path is synchronous — repositories and `db/store.ts` use sync `node:fs` and return plain values, so do not add `async`/`Promise` to repositories or to services for db-backed resources.
example: server/src/repositories/tags.repository.ts:6
check:
```

```rule
id: BE-039
severity: warn
scope: server/src/**/*.ts
statement: Each resource gets exactly one file per layer, named `<plural-resource>.<layer>.ts` and placed in the matching directory — `server/src/schemas/tags.schema.ts`, `repositories/tags.repository.ts`, `services/tags.service.ts`, `routes/tags.routes.ts`. Never combine two layers in one file and never introduce a new top-level directory for a resource.
example: server/src/services/tags.service.ts:1
check:
```

```rule
id: BE-040
severity: error
scope: server/src/routes/*.routes.ts
statement: A route file exports one `Router` as `<resource>Router` (e.g. `export const tagsRouter = Router()`) with paths relative to its mount point — the `/api/<resource>` prefix is added only by `apiRouter.use(...)` in `server/src/routes/index.ts`.
example: server/src/routes/index.ts:14
check:
```

```rule
id: BE-041
severity: error
scope: server/src/routes/index.ts
statement: Every router is mounted in `server/src/routes/index.ts` as `apiRouter.use('/<resource>', <resource>Router)` — an unmounted router is unreachable, so add the mount in the same change that creates the route file.
example: server/src/routes/index.ts:14
check:
```

```rule
id: BE-042
severity: error
scope: server/src/app.ts
statement: `server/src/app.ts` only builds and returns the Express app from the `createApp()` factory — middleware order is `express.json()`, `requestLogger`, `/api` router, `errorHandler`. Listening lives exclusively in `server/src/index.ts`; adding `.listen()`, `process.exit`, or startup side effects to `app.ts` breaks the supertest suites that call `createApp()`.
example: server/src/app.ts:7
check:
```

```rule
id: BE-043
severity: warn
scope: server/src/clients/*.ts
statement: Code that talks to a service we do not own lives in `server/src/clients/` and throws its own transport error type (e.g. `UpstreamHttpError` with `status` and optional `retryAfterSeconds`) while returning the shared domain type on success — clients never import `lib/errors.ts`, never log, and never know about the API envelope. The owning service maps those failures onto typed `AppError`s.
example: server/src/clients/inspirationClient.ts:49
check:
```

```rule
id: BE-044
severity: error
scope: server/src/**/*.ts
statement: Never call `console.*` anywhere under `server/src` — log through `logger` from `server/src/lib/logger.ts`. ESLint enforces `no-console: error` for `server/src/**/*.ts` with `lib/logger.ts` as the only exemption, so a bare `console.log` fails `npm run lint` and CI.
example: server/src/lib/logger.ts:24
check:
```

```rule
id: BE-045
severity: warn
scope: server/src/**/*.ts
statement: The first argument to every `logger.*` call is the scope string: the file's basename without `.ts` (`'tags.service'`, `'todos.service'`, `'errorHandler'`, `'index'`). The only non-file scope in the project is `'http'` in `requestLogger.ts`. Do not pass a class name, a route path, or a message as the first argument.
example: server/src/services/tags.service.ts:26
check:
```

```rule
id: BE-046
severity: warn
scope: server/src/services/*.service.ts
statement: Log messages are short lowercase phrases with no interpolated values (`'created tag'`, `'quote provider rate limited us'`); ids, statuses, and durations go in the third `meta` object argument (`{ id: tag.id }`). Do not build log strings with template literals in services.
example: server/src/services/tags.service.ts:26
check:
```

```rule
id: BE-047
severity: warn
scope: server/src/services/*.service.ts
statement: Services are the only layer that logs successful state changes: emit one `logger.info` after each create/update/delete/complete/reopen write succeeds, carrying `{ id }`. Repositories, schemas, and routes never log.
example: server/src/services/tags.service.ts:49
check:
```

```rule
id: BE-048
severity: warn
scope: server/src/**/*.ts
statement: Pick the log level by who is at fault: `logger.warn` for expected client-side or upstream failures (4xx `AppError`s, provider rate limits) and `logger.error` only for 5xx and unhandled errors. Never log an expected 404/409 at `error`.
example: server/src/middleware/errorHandler.ts:13
check:
```

```rule
id: BE-049
severity: error
scope: server/src/routes/*.routes.test.ts
statement: Route tests drive the app in-process with `supertest` against `createApp()` invoked once at describe scope (`const app = createApp()`), then `await request(app).<verb>(...)`. Never import `server/src/index.ts`, start a listener, or bind a port in a test.
example: server/src/routes/tags.routes.test.ts:8
check:
```

```rule
id: BE-050
severity: warn
scope: server/src/routes/*.routes.test.ts
statement: Route tests assert HTTP status plus the envelope fields — `res.body.data` for success and `res.body.error.code` (one of the shared `ApiErrorCode` values) for failures — and assert on `res.body.error.message` only via `toContain` of the offending id. Never assert against a bare/unwrapped response body.
example: server/src/routes/tags.routes.test.ts:28
check:
```

```rule
id: BE-051
severity: warn
scope: server/src/services/*.service.test.ts
statement: Service tests assert the typed error class, not HTTP status codes or message strings: `expect(() => svc.getById('x')).toThrow(NotFoundError)` for sync services, `await expect(svc.getQuote('x')).rejects.toBeInstanceOf(NotFoundError)` for async ones. Status/code assertions belong in the route test.
example: server/src/services/tags.service.test.ts:27
check:
```

```rule
id: BE-052
severity: warn
scope: server/src/**/*.test.ts
statement: Keep the three test layers to their own concerns: repository tests assert persistence and the `undefined`/`false` return for a missing id; service tests assert business rules, sorting, cascades, and typed errors; route tests assert status codes and the envelope. Do not re-test business rules through supertest or persistence through a service test.
example: server/src/repositories/tags.repository.test.ts:46
check:
```

```rule
id: BE-053
severity: warn
scope: server/src/**/*.test.ts
statement: When the module under test holds module-level mutable state, reset it in `beforeEach` through the module's exported test hook (e.g. `resetInspirationClient()` from `clients/inspirationClient.ts`) rather than `vi.resetModules()` or re-importing. If a new module needs the same, export a `reset<Thing>()` hook beside it.
example: server/src/services/inspiration.service.test.ts:10
check:
```

```rule
id: BE-054
severity: error
scope: server/src/**/*.ts
statement: `server/src/config.ts` is the only place in `server/src` that reads `process.env`. Import `config` and read `config.port` / `config.dataDir` / `config.logLevel` instead; the sole other permitted write is `makeTestDb()` setting `DATA_DIR` in `server/src/testing/helpers.ts`.
example: server/src/config.ts:7
check:
```

```rule
id: BE-055
severity: error
scope: server/src/config.ts
statement: Any env value read after process start is exposed as a lazy getter (`get dataDir()`, `get logLevel()`) so tests can repoint it mid-process; only values consumed once at boot (`port`) may be eagerly evaluated properties. Converting a getter to a plain property breaks `makeTestDb()`.
example: server/src/config.ts:9
check:
```

```rule
id: BE-056
severity: warn
scope: server/src/config.ts
statement: Every config value supplies an inline default with `??` so the server boots with zero environment configured — this repo has no `.env` file, no dotenv dependency, and no required secrets. Never add a var that throws or exits when unset, and never introduce a secret-shaped env var (API key, token, password); anything resembling a credential here is a mistake.
example: server/src/config.ts:6
check:
```

```rule
id: BE-057
severity: info
scope: server/src/**/*.ts
statement: Only `server/src/config.ts` computes a filesystem root, deriving it from the module URL (`path.dirname(fileURLToPath(import.meta.url))`) because the server is ESM and `__dirname` does not exist; every other module joins paths from `config.dataDir` rather than resolving its own.
example: server/src/config.ts:4
check:
```

```rule
id: BE-058
severity: error
scope: server/src/**/*.ts
statement: Import domain and API types from `@taskboard/shared` with `import type` — `Todo`, `Tag`, `List`, `ActivityEntry`, `TodoQuery`, `PageMeta`, `ApiErrorCode`, `StatsSummary`. Never redeclare or widen a shared entity locally in `server/src`; extend the shared file first (only `Db` in `db/store.ts` is server-local).
example: server/src/services/tags.service.ts:1
check:
```

```rule
id: BE-059
severity: warn
scope: server/src/**/*.ts
statement: Annotate an explicit return type on every exported service and repository method, including `void` — `findAll(): Tag[]`, `findById(id: string): Tag | undefined`, `remove(id: string): void`. Do not rely on inference for a layer boundary.
example: server/src/repositories/tags.repository.ts:6
check:
```

```rule
id: BE-060
severity: warn
scope: server/src/services/*.service.ts
statement: Declare a service's input shape as a local, non-exported `interface <Verb><Entity>Input` at the top of the service file, referencing shared entities for field types (`priority: Todo['priority']`). Do not derive it with `z.infer` from the schema and do not put request-input shapes in `shared/src/types.ts`.
example: server/src/services/todos.service.ts:10
check:
```

```rule
id: BE-061
severity: error
scope: server/src/**/*.ts
statement: Relative imports are extensionless (`'./app'`, `'../lib/logger'`, `'../db/store'`) even though the package is `"type": "module"` — the server runs through `tsx` with `moduleResolution: bundler`. Never append `.js` or `.ts` to a relative import specifier.
example: server/src/app.ts:2
check:
```

```rule
id: BE-062
severity: warn
scope: docs/**/*.md
statement: Put a decision in `docs/adr/NNNN-slug.md` copied from `docs/adr/template.md` (Status/Date/Deciders header, then Context / Decision / Consequences), a cross-cutting requirement in `docs/nfr/NNNN-slug.md`, and a repeatable recipe in `docs/best-practices/<task>.md`. Every doc names the concrete files where the rule lives in code; there is no OpenAPI/Swagger spec in this repo.
example: docs/adr/0001-shared-api-response-envelope.md:1
check:
```

```rule
id: BE-063
severity: warn
scope: server/src/**/*.ts
statement: A module that enforces an architectural boundary opens with a block comment stating the rule and naming the layer or doc that owns it (e.g. `db/store.ts` "the ONLY module that touches db.json", `lib/respond.ts` pointing at docs/adr/0001). Add that comment when you create such a module.
example: server/src/db/store.ts:13
check:
```

```rule
id: BE-064
severity: info
scope: shared/src/types.ts
statement: Document a shared field whose format is not obvious with a one-line `/** */` on the field itself — the encoding (`/** ISO date (YYYY-MM-DD), no time component. */`), an example value, or why it is denormalized. Self-evident fields stay uncommented.
example: shared/src/types.ts:14
check:
```

```rule
id: BE-065
severity: warn
scope: package.json
statement: CI runs only `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` on Node 20. A new workspace check must be wired into the root `test`/`typecheck` scripts, which fan out with `-ws --if-present`, rather than added as a separate GitHub Actions step.
example: package.json:8
check:
```

```rule
id: BE-066
severity: warn
scope: server/**
statement: The server has no build step: it runs TypeScript sources directly via `tsx` (`tsx watch src/index.ts` for dev, `tsx src/index.ts` for start) and `tsconfig.base.json` sets `noEmit`. Never add a bundler/`tsc` emit, a `dist/` output, or an import from a built path — `@taskboard/shared` is likewise consumed as TS source via its `exports: "./src/index.ts"`.
example: server/package.json:7
check:
```

```rule
id: BE-067
severity: info
scope: server/src/**/*.ts
statement: Prefer the non-mutating ES2023 array built-ins in services — `array.toSorted(...)` rather than copy-then-`sort` — and import Node builtins with the `node:` prefix; `crypto.randomUUID()` is called only inside `server/src/lib/ids.ts`.
example: server/src/services/tags.service.ts:10
check:
```
