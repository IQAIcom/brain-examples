# ABI Agent

## Overview

The **ABI Agent** is a specialized agent that can query and interact with smart contracts using their Application Binary Interface (ABI). This agent is particularly useful for interacting with smart contracts on the blockchain. This example implements a ERC20 configured agent with read/write capabilities.

## Plugins Overview

### ABI Plugin

The **ABI Plugin** enables the agent to:

- Query contract functions and their parameters
- Execute contract methods
- Read contract state

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/abi-agent
```

Then, follow the installation instructions below.

## Installation

Ensure all required packages are installed by running:

```bash
pnpm install
```

To run the agent, open a terminal in your project directory and execute:

```bash
pnpm dev
```

Ensure you have the following environment variables set in your .env file:

```env
WALLET_PRIVATE_KEY=your-wallet-private-key
OPENAI_API_KEY=your-openai-api-key
```

## Query Examples

- **Sample Queries:**

  ```plaintext
  # Example 1: Query ERC20 token balance
  What is the balance of this ERC20 token for address 0x123...?

  # Example 2: Get token information
  What is the symbol of this ERC20 token?

  # Example 3: Check token allowance
  What is the allowance for this token between owner and spender?
  ```

## Docker Support

To run the agent using Docker Compose:

1. Make sure you have Docker Desktop installed on your system

2. Create a `.env` file in the `apps/abi-agent` directory with your environment variables:

```env
WALLET_PRIVATE_KEY=your-wallet-private-key
OPENAI_API_KEY=your-openai-api-key
```

3. Build and run the container:

```bash
# Build and start the container
docker-compose -f ./docker-compose.yml up --build

# Or run in detached mode (background)
docker-compose -f ./docker-compose.yml up -d --build
```

4. Useful Docker Compose commands:

```bash
# View logs
docker-compose -f ./docker-compose.yml logs -f

# Stop the container
docker-compose -f ./docker-compose.yml down

# Rebuild and restart
docker-compose -f ./docker-compose.yml up --build --force-recreate
```

The container will be accessible on port 3000 and will automatically restart unless explicitly stopped.

## Documentation

For more information about the ABI plugin and its capabilities, visit:
[ABI Plugin Documentation](https://brain.iqai.com/plugins/abi)
