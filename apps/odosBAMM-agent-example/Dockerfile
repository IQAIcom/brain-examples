# Use an official Node.js runtime as a parent image
FROM node:23.8.0

# Set the working directory in the container
WORKDIR /src/index

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "index.ts"]