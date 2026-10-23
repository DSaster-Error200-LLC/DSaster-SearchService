# DSaster-SearchService

## Project setup

```bash
pnpm install
```

## Run the project

```bash
pnpm dev
```

## Version

The app needs the `APP_VERSION` environment variable and refuses to start without it. It shows the version in Swagger and logs it at startup, just before `Listening on`.

`pnpm dev` and `pnpm start` set it from the git tags:

- On a commit tagged `vX.Y.Z`: `X.Y.Z`
- N commits after the latest tag: `X.Y.Z-dev.N`

```bash
pnpm --silent app-version   # prints the version, for example 1.1.0-dev.4
```

A clone without tags cannot derive it: run `git fetch --tags`.

## Storage

Events are stored in Elasticsearch (9.5) when the `ELASTICSEARCH_URL` environment variable is set, for example `http://localhost:9200`. The app creates the `events` index on startup if it does not exist.

Without `ELASTICSEARCH_URL`, events are kept in memory and are lost on restart.

```bash
ELASTICSEARCH_URL=http://localhost:9200 pnpm dev
```

With `ELASTICSEARCH_URL` set, `pnpm test` also runs the repository contract (`test/contracts/event-repository.contract.ts`) against that Elasticsearch, using a separate `events-contract-test` index.

## Run with Docker

```bash
docker build --build-arg APP_VERSION=$(pnpm --silent app-version) -t dsaster-search .
docker run --rm -p 5201:5201 dsaster-search
```

The `APP_VERSION` build argument sets the version inside the container, which does not start without it. The release pipeline passes the version of the tag it publishes.

The API is served on `http://localhost:5201` and Swagger on `http://localhost:5201/swagger`.

The image checks `GET /health` every 10 seconds, so `docker ps` shows the container as `healthy` once the app responds.

## Run with Docker Compose

The `docker-compose.yml` defines three services: `elasticsearch`, `kibana` and `dsaster-search`.

`pnpm compose` runs `docker compose` with `APP_VERSION` set from the git tags, which the `dsaster-search` image needs to build. Plain `docker compose` works for the commands that do not build it.

### Everything at once (backend + Elasticsearch + Kibana):

```bash
pnpm compose up --build
```

- API on `http://localhost:5201`
- Swagger on `http://localhost:5201/swagger`
- Elasticsearch on `http://localhost:9200`
- Kibana on `http://localhost:5601`

### Backend and Elasticsearch only (no Kibana):

```bash
pnpm compose up elasticsearch dsaster-search --build
```

### Only Elasticsearch, then run the backend locally for development:

```bash
docker compose up elasticsearch
```

In another terminal:

```bash
ELASTICSEARCH_URL=http://localhost:9200 pnpm dev
```

### To stop everything:

```bash
docker compose down
```

Add `-v` to also remove the Elasticsearch data volume:

```bash
docker compose down -v
```

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
