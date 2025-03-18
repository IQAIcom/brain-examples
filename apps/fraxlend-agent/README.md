# FraxLend Agent Example

## Overview

The **FraxLend Agent Example** allows your agent to check his positions every 24hrs and decide to withdraw and lend if APR of new pools are > 3% of his current positions on fraxtal then post on telegram

## Plugins Overview

### FraxLend Plugin

The **FraxLend Plugin** allows your agent to lending, borrowing, withdrawing, and managing collateral on the Fraxtal network.

### Heartbeat Plugin

The **Heartbeat** Plugin enables automated scheduling of tasks and social media interactions

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/fraxlend-agent-example
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

Ensure you have the following environment variable set in your .env file:

```env
WALLET_PRIVATE_KEY=your-wallet-private-key
TELEGRAM_CHAT_ID="bot-token"
SERVER_PORT="3000"
USE_OPENAI_EMBEDDING="TRUE"
OPENAI_API_KEY="sk-openai-api-key"
```

## Query Examples

- **Sample Queries:**

  ```plaintext
  Check if APR of new pools are > 3% of his current positions, then borrow and lend daily
  ```

### More Queries: Try any combination of queries in the following doc

[FraxLend Doc](https://brain.iqai.com/plugins/fraxlend)
[Heartbeat Doc](https://brain.iqai.com/plugins/heartbeat)
