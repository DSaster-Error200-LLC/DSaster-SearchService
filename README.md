# DSaster-SearchService

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

DSaster-SearchService is the search backend of the DSaster ticketing system. It owns event discovery: it lets users search for events and returns the results.

## Docs

- [Development](./src/dsaster-search/README.md)

## Branch Strategy

### Naming

```text
{type}/#n
```

Where `n` is the issue number.

- Feature: `feat/#n`
- Task: `task/#n`
- Bug: `fix/#n`

Example:

- `feat/#123`

### Completion

When finished, open a pull request to the `main` branch.

## Releases

A release is a `vM.m.p` git tag pushed from `main` (`v1.4.2`, not `v1.04.2`). The tag is what starts the release pipeline, so a pushed tag is a published release: never move or reuse one, release a new version instead.

Create the tag with the bump script:

```bash
scripts/bump.sh                # checks, menu, confirmation
scripts/bump.sh --minor -y     # checks only, no questions
scripts/bump.sh --dry-run      # only show the next version
```

Before tagging, it checks that you are on `main` with a clean working tree, level with `origin/main`, that the CI passed for that commit and that `pnpm test` passes. It needs [Git](https://git-scm.com), the [GitHub CLI](https://cli.github.com) (`gh auth login` once) and `pnpm install` run in `src/dsaster-search`.

`--alpha` and `--beta` create pre-releases such as `v1.1.1-alpha`; `scripts/bump.sh --help` lists every option. What each kind of version triggers is described in "How releases are done" in the dev guidelines.
