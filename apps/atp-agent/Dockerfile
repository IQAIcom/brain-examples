FROM node:20-slim

WORKDIR /app

# Install dependencies for native modules
RUN apt-get update && apt-get install -y git \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json ./
COPY tsconfig.json ./
# copy the env file
COPY .env ./

RUN npm install

# Copy source code
COPY src/ ./src/

# Create data directory
RUN mkdir -p ./data

# Run the application
CMD ["npm", "start"]