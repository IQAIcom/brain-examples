FROM --platform=linux/amd64 node:23-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ curl git

# Copy package management files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/atp-agent/package.json ./apps/atp-agent/
COPY packages ./packages

# Install dependencies globally
RUN npm install -g pnpm tsx
# First install to update lockfile if needed
RUN pnpm install --filter="./apps/atp-agent..."
RUN pnpm install --filter="./apps/atp-agent..." --frozen-lockfile

# Copy only the ATP agent code
COPY apps/atp-agent ./apps/atp-agent

# Create data directory for SQLite with proper permissions
RUN mkdir -p /app/apps/atp-agent/data && \
    chown -R node:node /app/apps/atp-agent/data

# Set working directory to the app
WORKDIR /app/apps/atp-agent

# Run the app
CMD ["tsx", "src/index.ts"]