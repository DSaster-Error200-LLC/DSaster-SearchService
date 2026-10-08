# DSaster-SearchService

## Project setup

```bash
pnpm install
```

## Run the project

```bash
pnpm dev
```

## Storage

Events are stored in Elasticsearch (9.5) when the `ELASTICSEARCH_URL` environment variable is set, for example `http://localhost:9200`. The app creates the `events` index on startup if it does not exist.

Without `ELASTICSEARCH_URL`, events are kept in memory and are lost on restart.

```bash
ELASTICSEARCH_URL=http://localhost:9200 pnpm dev
```

With `ELASTICSEARCH_URL` set, `pnpm test` also runs the repository contract (`test/contracts/event-repository.contract.ts`) against that Elasticsearch, using a separate `events-contract-test` index.

## Run with Docker

```bash
docker build -t dsaster-search .
docker run --rm -p 3000:3000 dsaster-search
```

The API is served on `http://localhost:3000` and Swagger on `http://localhost:3000/swagger`.

The image checks `GET /health` every 10 seconds, so `docker ps` shows the container as `healthy` once the app responds.

## Run before commit

```bash
pnpm lint
pnpm format
pnpm test
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
