FROM --platform=linux/amd64 node:23-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ curl git

# Copy package management files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/abi-agent/package.json ./apps/abi-agent/
COPY packages ./packages

# Install dependencies globally
RUN npm install -g pnpm tsx
# First install to update lockfile if needed
RUN pnpm install --filter="./apps/abi-agent..."
RUN pnpm install --filter="./apps/abi-agent..." --frozen-lockfile

# Copy only the ABI agent code
COPY apps/abi-agent ./apps/abi-agent

# Create data directory for SQLite with proper permissions
RUN mkdir -p /app/apps/abi-agent/data && \
    chown -R node:node /app/apps/abi-agent/data

# Set working directory to the app
WORKDIR /app/apps/abi-agent

# Run the app
CMD ["tsx", "src/index.ts"] 