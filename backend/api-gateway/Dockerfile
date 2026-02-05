FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache dumb-init

RUN corepack enable

# Install deps (keep devDeps since we run tsx at runtime)
COPY backend/api-gateway/package.json backend/api-gateway/pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

# Copy gateway source
COPY backend/api-gateway/src ./src
COPY backend/api-gateway/tsconfig.json ./tsconfig.json

# Copy shared TS utils to the absolute path expected by tsconfig paths for Docker
COPY backend/shared/typescript /shared/typescript

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "start"]

