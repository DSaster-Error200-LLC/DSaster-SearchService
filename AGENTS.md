# AGENTS.md

Guide for AI coding agents working in this repository.

DSaster-SearchService is the search backend of the DSaster ticketing system: a NestJS + TypeScript service that owns event search. See [README.md](./README.md) for the overview.

## Project layout

The application lives in `src/dsaster-search`. Run every command from that directory.

```text
src/dsaster-search/
├── src/
│   ├── main.ts               # Bootstrap: configureApp, Swagger at /swagger
│   ├── app.module.ts         # Root module
│   ├── config/
│   │   ├── configuration.ts  # configureApp: global ValidationPipe
│   │   └── openapi.ts        # OpenAPI document builder
│   └── events/               # Events feature module, split into layers (see Architecture)
│       ├── domain/
│       │   ├── entities/     # Types with identity (Event)
│       │   ├── value-objects/ # Types defined only by their values (Venue)
│       │   └── errors/       # Domain errors
│       ├── application/
│       │   ├── ports/        # Repository ports (EventRepository)
│       │   ├── models/       # Use case input and output models
│       │   └── use-cases/    # Use cases and their specs
│       ├── infrastructure/   # EventRepository implementations
│       ├── presentation/
│       │   ├── controllers/  # Controllers and their specs
│       │   ├── filters/      # Exception filters (domain errors to HTTP)
│       │   └── dto/          # Request and response DTOs
│       └── events.module.ts  # Wires the layers together
├── scripts/generate-openapi.ts
├── openapi/openapi.json      # Generated spec, committed to git
└── test/
    ├── events/               # e2e tests, one file per endpoint (*.e2e-spec.ts)
    ├── fixtures/             # Shared test data, used by unit and e2e tests
    └── utils/                # Test helpers such as createTestApp
```

Current state: events are kept in `InMemoryEventRepository` (they are lost on restart), and `POST /events/{eventId}` registers them so they show up in search results.

## Architecture

Feature modules follow Clean Architecture. The dependency rule is: **source code dependencies only point inwards**.

```text
presentation ──▶ application ──▶ domain
infrastructure ──▶ application + domain
```

| Layer | Contains | May depend on |
|---|---|---|
| `domain/` | Entities (types with an identity, such as `Event`) in `entities/`, value objects (types without identity, defined only by their values, such as `Venue`) in `value-objects/`, domain errors in `errors/` | Nothing |
| `application/` | Use cases in `use-cases/`, repository ports (abstract classes) in `ports/`, use case input and output models such as `RegisterEventCommand` and `EventDetails` in `models/` | `domain/` |
| `infrastructure/` | Port implementations such as `InMemoryEventRepository` | `application/`, `domain/`, frameworks |
| `presentation/` | Controllers in `controllers/`, exception filters in `filters/`, request and response DTOs in `dto/` | `application/`, `domain/`, frameworks |

Rules:

* **`domain/` and `application/` are framework-free.** No `@nestjs/*`, `class-validator` or `class-transformer` imports, and no `@Injectable()` on use cases. ESLint enforces this and the dependency rule; spec files are exempt.
* **Use cases are plain classes** with an `execute` method, registered in the module with `useFactory` and `inject`.
* **Entities do not cross the boundary.** Use cases return output models (`EventPreview`, `EventDetails`), never domain entities. Response DTOs `implements` those models so the compiler checks they match.
* **Ports are abstract classes**, because TypeScript interfaces cannot be DI tokens. Bind them in the module with `{ provide: Port, useClass: Adapter }`.
* **Errors:** use cases throw domain errors (`domain/errors/`), never HTTP exceptions. `presentation/filters/domain-errors.filter.ts` maps them to HTTP responses (for example, already registered to 409 and not found to 404).
* **OpenAPI schema names:** response DTOs set `@ApiSchema({ name })` so the spec uses the model name (`Event`, `EventPreview`) instead of the class name.

Common changes:

* **New use case:** add `application/use-cases/<name>.use-case.ts` and its spec, register it with `useFactory` in the module, call it from the controller, and add its e2e tests in `test/<module>/<name>.e2e-spec.ts`.
* **New storage:** implement the port from `application/ports/` in `infrastructure/` and change the `useClass` binding in the module. Use cases and domain do not change.
* **New domain error:** add `domain/errors/<name>.error.ts`, then map it in the error filter and its `@Catch(...)` list.

## Requirements

* Node.js >= 24.15.0
* pnpm 12.4.1 (pinned in `package.json`)

## Commands

Run from `src/dsaster-search`:

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Run in watch mode |
| `pnpm build` | Build the project |
| `pnpm lint` | Lint (ESLint) |
| `pnpm format` | Format `.ts` files (Prettier) |
| `pnpm format:check` | Check formatting on the whole project |
| `pnpm test` | Unit tests (`*.spec.ts`) |
| `pnpm test:e2e` | End-to-end tests (`test/**/*.e2e-spec.ts`) |
| `pnpm api` | Regenerate `openapi/openapi.json` |

Before finishing a change, run `pnpm lint`, `pnpm format`, `pnpm test`, `pnpm test:e2e` and `pnpm api`. The CI runs the same checks on every pull request.

## Conventions

* **Modules:** ESM only (`"type": "module"`). Relative imports end in `.js`.
* **Imports:** use `./` for files in the same folder and the `@app/*` alias (maps to `src/*`) for anything else, such as imports between layers. Tests use `@test/*` (maps to `test/*`) for fixtures and helpers. ESLint rejects backwards relative imports such as `../`.
* **One type per file:** each exported interface, class or type lives in its own file named after it, including nested payload types such as `VenueResponse` or `RegisterVenueRequest`. A mapper function goes in the same file as the type it builds (for example `toEventDetails` in `event-details.ts`).
* **Formatting:** Prettier with double quotes.
* **Validation:** request DTOs live in `presentation/dto/` and use `class-validator`. The global `ValidationPipe` is created in `configureApp` (`src/config/configuration.ts`) and rejects unknown properties. Tests that boot the app must call `configureApp` too; `createTestApp` (`test/utils/`) already does.
* **API documentation:** annotate every controller method and DTO with `@nestjs/swagger` decorators (operation, parameters, responses and the conditions that produce them).
* **OpenAPI spec:** `openapi/openapi.json` is generated. Any change to the API requires running `pnpm api` and committing the result. The CI fails if it is out of date.
* **Tests:** unit tests sit next to the code as `*.spec.ts`. End-to-end tests go in `test/<module>/`, one `*.e2e-spec.ts` file per endpoint, and boot the app with `createTestApp`. Vitest globals are enabled.
  * Reuse the shared data in `test/fixtures/` instead of redefining it in each test. Fixtures live outside `src/` so they never reach the build.
  * Use case tests run against the real `InMemoryEventRepository` instead of mocks. Controller tests import the feature module so they also check the wiring.

## Git workflow

* **Commits:** use [Conventional Commits](https://www.conventionalcommits.org/): `type(optional scope): description`. Types in use are `feat`, `fix`, `refactor`, `test`, `docs`, `ci` and `chore` (for example `feat: add event search endpoint`, `ci(api-pr): rename job`).
* **Branches:** `feat/#n`, `task/#n` or `fix/#n`, where `n` is the issue number.
* **Pull requests:** open them against `main`. The CI runs format and lint, build and tests (unit and e2e), and the OpenAPI spec check.
