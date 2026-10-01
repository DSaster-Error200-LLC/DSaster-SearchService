ARG NODE_IMAGE=node:24-alpine

FROM ${NODE_IMAGE} AS base
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
COPY package.json ./
RUN corepack enable && corepack install

FROM base AS dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# --ignore-scripts skips "prepare", which installs the Husky git hooks
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM dependencies AS build
COPY . .
RUN pnpm build

FROM base AS production-dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production
RUN apk add --no-cache tini
WORKDIR /app
COPY package.json ./
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]
