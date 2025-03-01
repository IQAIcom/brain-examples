# Use an official Node.js runtime as a parent image
FROM node:23

# Set the working directory in the container
WORKDIR /app

# Install build tools and dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# Install pnpm globally within the container
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Approve build scripts
# RUN pnpm build

# Rebuild native addons
RUN pnpm rebuild

# Copy the rest of the application code
COPY . .

# Install tsx globally within the container
RUN npm install -g tsx

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["tsx", "src/index.ts"]