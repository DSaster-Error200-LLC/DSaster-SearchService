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
│   ├── configuration.ts      # configureApp: global ValidationPipe
│   ├── openapi.ts            # OpenAPI document builder
│   └── events/               # Events module (controller, service, module, specs)
├── scripts/generate-openapi.ts
├── openapi/openapi.json      # Generated spec, committed to git
└── test/                     # e2e tests (*.e2e-spec.ts)
```

Current state: events are kept in an in-memory store (they are lost on restart), and `POST /events/{eventId}` registers them so they show up in search results.

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
| `pnpm test:e2e` | End-to-end tests (`test/*.e2e-spec.ts`) |
| `pnpm api` | Regenerate `openapi/openapi.json` |

Before finishing a change, run `pnpm lint`, `pnpm format`, `pnpm test`, `pnpm test:e2e` and `pnpm api`. The CI runs the same checks on every pull request.

## Conventions

* **Modules:** ESM only (`"type": "module"`). Relative imports end in `.js`.
* **Imports:** use the `@app/*` alias (maps to `src/*`) instead of backwards relative imports such as `../`. ESLint rejects them.
* **Formatting:** Prettier with double quotes.
* **Validation:** request DTOs use `class-validator`. The global `ValidationPipe` is created in `configureApp` (`src/configuration.ts`) and rejects unknown properties. Tests that boot the app must call `configureApp` too.
* **API documentation:** annotate every controller method and DTO with `@nestjs/swagger` decorators (operation, parameters, responses and the conditions that produce them).
* **OpenAPI spec:** `openapi/openapi.json` is generated. Any change to the API requires running `pnpm api` and committing the result. The CI fails if it is out of date.
* **Tests:** unit tests sit next to the code as `*.spec.ts`. End-to-end tests go in `test/` as `*.e2e-spec.ts`. Vitest globals are enabled.

## Git workflow

* **Commits:** use [Conventional Commits](https://www.conventionalcommits.org/): `type(optional scope): description`. Types in use are `feat`, `fix`, `refactor`, `docs`, `ci` and `chore` (for example `feat: add event search endpoint`, `ci(api-pr): rename job`).
* **Branches:** `feat/#n`, `task/#n` or `fix/#n`, where `n` is the issue number.
* **Pull requests:** open them against `main`. The CI runs format and lint, build and tests (unit and e2e), and the OpenAPI spec check.
