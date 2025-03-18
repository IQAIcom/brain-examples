FROM node:20-slim

WORKDIR /app

# Install build dependencies and clean up in the same layer
RUN apt-get update && \
    apt-get install -y python3 make g++ curl git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json files for workspace setup
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/imageload-agent-example/package.json ./apps/imageload-agent-example/

# Install pnpm and tsx
RUN npm install -g pnpm tsx

# Copy source code
COPY apps/imageload-agent-example ./apps/imageload-agent-example
COPY packages ./packages

# Install dependencies once at the workspace root
RUN pnpm install --frozen-lockfile

# Set working directory to the app
WORKDIR /app/apps/imageload-agent-example

# Create data directory for SQLite
RUN mkdir -p ./data

# Directly run the TypeScript file
CMD ["tsx", "src/index.ts"] 