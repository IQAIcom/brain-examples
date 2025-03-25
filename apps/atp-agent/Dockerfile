FROM --platform=linux/amd64 node:23-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ curl git

# Copy package management files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/atp-agent/package.json ./apps/atp-agent/
COPY packages ./packages

# First install to update lockfile if needed
RUN pnpm install --filter="./apps/atp-agent..."

# Install dependencies globally
RUN npm install -g pnpm tsx
RUN pnpm install --filter="./apps/atp-agent..." --frozen-lockfile

# Copy only the ATP agent code
COPY apps/atp-agent ./apps/atp-agent

# Create data directory for SQLite with proper permissions
RUN mkdir -p /app/apps/fraxlend-agent/data && \
    chown -R node:node /app/apps/fraxlend-agent/data

# Set working directory to the app
WORKDIR /app/apps/atp-agent

# Run the app
CMD ["tsx", "src/index.ts"]