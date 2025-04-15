FROM node:20-alpine
WORKDIR /app

# Install git using Alpine package manager
RUN apk add --no-cache git

# Install dependencies
RUN npm install -g pnpm
COPY package.json ./
COPY tsconfig.json ./
RUN pnpm install

# Add build dependencies for native modules
RUN apk add --no-cache make gcc g++ python3

# Copy source code
COPY src/ ./src/

# Create data directory
RUN mkdir -p ./data

# Set environment variables (these will be overridden by actual env vars)
ENV USE_OPENAI_EMBEDDING="TRUE"
ENV OPENAI_API_KEY=""
ENV SERVER_PORT="3000"
ENV TELEGRAM_BOT_TOKEN=""
ENV TELEGRAM_CHAT_ID=""
ENV WALLET_PRIVATE_KEY=""

# Run the application
CMD ["pnpm", "start"]