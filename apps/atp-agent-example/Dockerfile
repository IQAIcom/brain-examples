FROM node:23-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ curl git

# Copy package.json files for workspace setup
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/atp-agent-example/package.json ./apps/atp-agent-example/

# Install pnpm and tsx
RUN npm install -g pnpm tsx

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY apps/atp-agent-example ./apps/atp-agent-example
COPY packages ./packages

# Set working directory to the app
WORKDIR /app/apps/atp-agent-example

# Install dependencies directly in the app
RUN pnpm install --no-frozen-lockfile

# Create data directory for SQLite
RUN mkdir -p ./data

# Directly run the TypeScript file
CMD ["tsx", "src/index.ts"]
