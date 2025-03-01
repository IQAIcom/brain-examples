# Use an official Node.js runtime as a parent image
FROM node:23.8.0

# Set the working directory in the container
WORKDIR /src

# Copy package.json and pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# Install pnpm globally within the container
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Install typescript
RUN npm install -g typescript
# Compile the TypeScript code to JavaScript
RUN tsc

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "index.js"]