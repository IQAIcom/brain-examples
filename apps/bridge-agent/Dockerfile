FROM node:23-slim

WORKDIR /app

# Install dependencies for native modules
RUN apt-get update && apt-get install -y git \
  && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json ./
COPY tsconfig.json ./
RUN npm install

# Copy source code
COPY src/ ./src/

# Create data directory
RUN mkdir -p ./data

# Set environment variables (these will be overridden by actual env vars)
ENV USE_OPENAI_EMBEDDING="TRUE"
ENV OPENAI_API_KEY=""
ENV SERVER_PORT="3000"
ENV TELEGRAM_BOT_TOKEN=""
ENV WALLET_PRIVATE_KEY=""

# Run the application
CMD ["npm", "start"]