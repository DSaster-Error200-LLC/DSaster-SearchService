# DSaster-SearchService

## Project setup

```bash
pnpm install
```

## Run the project

```bash
pnpm dev
```

## Run before commit

```bash
pnpm lint
pnpm format
pnpm test
pnpm api
```

## Releases

A release is a `vM.m.p` git tag pushed from `main` (`v1.4.2`, not `v1.04.2`). The tag is what starts the release pipeline, so a pushed tag is a published release: never move or reuse one, release a new version instead.

Create the tag with the bump script. It lives in the repository root and works from any folder:

```bash
../../scripts/bump.sh                # checks, menu, confirmation
../../scripts/bump.sh --minor -y     # checks only, no questions
../../scripts/bump.sh --dry-run      # only show the next version
```

Before tagging, it checks that you are on `main` with a clean working tree, level with `origin/main`, that the CI passed for that commit and that `pnpm test` and `pnpm test:e2e` pass. It needs [Git](https://git-scm.com), the [GitHub CLI](https://cli.github.com) (`gh auth login` once) and `pnpm install` run in this folder.

`--alpha` and `--beta` create pre-releases such as `v1.1.1-alpha`; `../../scripts/bump.sh --help` lists every option. What each kind of version triggers is described in "How releases are done" in the dev guidelines.
