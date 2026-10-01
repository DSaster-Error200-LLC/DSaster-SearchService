# DSaster-SearchService

## Project setup

```bash
pnpm install
```

## Run the project

```bash
pnpm dev
```

## Run with Docker

```bash
docker build -t dsaster-search .
docker run --rm -p 3000:3000 dsaster-search
```

The API is served on `http://localhost:3000` and Swagger on `http://localhost:3000/swagger`.

## Run before commit

```bash
pnpm lint
pnpm format
pnpm test
pnpm api
```
