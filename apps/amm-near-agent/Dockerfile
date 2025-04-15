FROM --platform=linux/amd64 node:23-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ curl git

# Copy package management files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/amm-near-agent/package.json ./apps/amm-near-agent/
COPY packages ./packages

# Install dependencies globally
RUN npm install -g pnpm tsx
# First install to update lockfile if needed
RUN pnpm install --filter="./apps/amm-near-agent..."
RUN pnpm install --filter="./apps/amm-near-agent..." --frozen-lockfile

# Copy only the Amm-Near agent code
COPY apps/amm-near-agent ./apps/amm-near-agent

# Create data directory for SQLite with proper permissions
RUN mkdir -p /app/apps/amm-near-agent/data && \
    chown -R node:node /app/apps/amm-near-agent/data

# Set working directory to the app
WORKDIR /app/apps/amm-near-agent

# Run the app
CMD ["tsx", "src/index.ts"]