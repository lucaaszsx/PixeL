# Build
FROM node:20-alpine AS builder
ARG PNPM_VERSION=10.28.2
WORKDIR /app

RUN npm install -g pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Runtime
FROM node:20-alpine AS runner
ARG PNPM_VERSION=10.28.2
WORKDIR /app

RUN npm install -g pnpm@${PNPM_VERSION}

# Setup node environment
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy build artifacts
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json pnpm-lock.yaml ./

USER node

CMD ["pnpm", "start"]