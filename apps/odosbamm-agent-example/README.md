# odosBAMM Agent Example

## Overview

The **odosBAMM Agent Example** integrates multiple plugins to enable seamless interaction with decentralized finance (DeFi) protocols. This agent combines the capabilities of the Odos, BAMM, Sequencer, and Telegram/Discord plugins to facilitate token swaps, borrowing, lending, and complex multi-step operations.

## Plugins Overview

### Odos Plugin

The **Odos Plugin** allows your agent to perform efficient token swaps using the Odos protocol. It provides optimized routing for token exchanges, ensuring competitive rates and minimal slippage.

### BAMM Plugin

The **BAMM Plugin** enables interaction with BAMM, a decentralized platform for borrowing, lending, and managing liquidity positions in Fraxswap-style pools. It supports various operations such as borrowing, lending, adding/removing collateral, and managing LP tokens.

### Sequencer Plugin

The **Sequencer Plugin** facilitates complex multi-step operations by:

- Coordinating multiple actions in a specific sequence.
- Handling state and context across actions.
- Providing detailed execution feedback.

### Telegram/Discord Client

The **Telegram/Discord Client** allows your agent to interact with Discord servers, supporting message handling, voice interactions, and slash commands.

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/odosBAMM-agent-example
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
DISCORD_API_TOKEN=your_bot_token
```

## Query Examples

- **Sample Queries:**

  ```plaintext
  Get me a quote for swapping 1 wfrxEth to FRAX on Fraxtal then get me All bamm pools
  ```

  ```plaintext
  Post a quote for swapping 1 wfrxEth to FRAX on Fraxtal on Telegram and Discord
  ```

  ```plaintext
  Swap 100 DAI to FXS then add 100k collateral of 0xCc3023635dF54FC0e43F47bc4BeB90c3d1fbDa9f to this 0xC5B225cF058915BF28D7d9DFA3043BD53C63Ea84 bamm and finally post my Bamm postions on Discord
  ```

### More Queries: Try any combination of queries in the following doc

[Odos Doc](https://brain.iqai.com/plugins/odos)
[Bamm Doc](https://brain.iqai.com/plugins/bamm)
