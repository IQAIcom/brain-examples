FROM --platform=linux/amd64 node:23-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y python3 make g++ curl git

# Copy package management files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/odosbamm-agent-example/package.json ./apps/odosbamm-agent-example/
COPY packages ./packages

# Install dependencies globally
RUN npm install -g pnpm tsx
RUN pnpm install --filter="./apps/odosbamm-agent-example..." --frozen-lockfile

# Copy only the odosbamm agent code
COPY apps/odosbamm-agent-example ./apps/odosbamm-agent-example

# Create data directory for SQLite with proper permissions
RUN mkdir -p /app/apps/fraxlend-agent-example/data && \
    chown -R node:node /app/apps/fraxlend-agent-example/data

# Set working directory to the app
WORKDIR /app/apps/odosbamm-agent-example

# Run the app
CMD ["tsx", "src/index.ts"]