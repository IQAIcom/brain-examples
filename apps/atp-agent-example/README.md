# odosBAMM Agent Example

## Overview

The **ATP Agent Example** the agent use heartbeat plugin to check top agents daily and buy tokens using 1% of his IQ holdings on fraxtal, this is done with addition of a simple custom plugin ie **iqBalancePlugin**

## Plugins Overview

### ATP Plugin

The **ATP Plugin** allows for Buying, selling, and managing AI agent tokens using IQ as the base currency.

### Heartbeat Plugin

The **Heartbeat** Plugin enables automated scheduling of tasks and social media interactions

### Custom Plugin: iqBalancePlugin

This handles the check balance on fraxtal

### Sequencer Plugin

The **Sequencer Plugin** facilitates complex multi-step operations by:

- Coordinating multiple actions in a specific sequence.
- Handling state and context across actions.
- Providing detailed execution feedback.

## Installation

Ensure all required packages are installed by running:

```bash
pnpm install
```

If any packages are missing, install them using:

```bash
pnpm add @elizaos/core @iqai/plugin-heartbeat @eliza/plugin-atp @iqai/agent @iqai/plugin-sequencer @eliza/plugin-bootstrap @elizaos/adapter-sqlite @elizaos/client-direct node:path node:fs @iqai/plugin-sequencer
```

To run the agent, open a terminal in your project directory and execute:

```bash
pnpm dev
```

Ensure you have the following environment variable set in your .env file:

```env
WALLET_PRIVATE_KEY=your-wallet-private-key
SERVER_PORT="3000"
USE_OPENAI_EMBEDDING="TRUE"
OPENAI_API_KEY="sk-openai-api-key"
TELEGRAM_CHAT_ID="bot-token"
```

## Query Examples

- **Sample Querries:**

  ```plaintext
  Check and post top agent, check my IQ balance then buy tokens using 1% of his IQ holdings daily
  ```

### More Queries: try any combination of queires in the following doc

[ATP Doc] (https://brain.iqai.com/plugins/atp)
[Heartbeat Doc] (https://brain.iqai.com/plugins/heartbeat)
