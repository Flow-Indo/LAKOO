# ========================================
# ORDER SERVICE DOCKERFILE
# ========================================

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY scripts ./scripts/

RUN pnpm install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src/

RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache openssl dumb-init wget
RUN corepack enable

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && pnpm store prune

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3006

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3006/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]

