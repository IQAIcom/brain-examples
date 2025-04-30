FROM node:23-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install build essentials and Python for native addons
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate \
  && npm install -g turbo

# ---- Prune: Generate minimal monorepo for the target app ----
FROM base AS pruner
WORKDIR /repo
COPY . .
# Prune the monorepo for the target app
# Output is in /repo/out/full
RUN turbo prune @iqai/sophia-agent --docker

# ---- Runner: Build and run the final application ----
FROM base AS runner
WORKDIR /app

COPY --from=pruner /repo/out/json/pnpm-lock.yaml .

COPY --from=pruner /repo/out/full .

RUN pnpm install --frozen-lockfile --prod=false

WORKDIR /app/apps/sophia-agent

CMD ["pnpm", "run", "start"]
