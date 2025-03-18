<<<<<<< HEAD:apps/imageload-agent/README.md
# ImageLoad Agent Example

## Overview

The **ImageLoad Agent Example** integrates multiple plugins to enable your agent generate images and captions, and post them on a daily basis.

## Plugins Overview

### Image Plugin

The **Image Plugin** allows your agent to generate AI images using Anthropic and Together services, with automatic captions generation.

### Heartbeat Plugin

The **Heartbeat** Plugin enables automated scheduling of tasks and social media interactions.
=======
# ATP Agent Example

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
>>>>>>> setup-ci:apps/atp-agent-example/README.md

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
<<<<<<< HEAD:apps/imageload-agent/README.md
cd brain-examples/apps/imageload-agent-example
=======
cd brain-examples/apps/atp-agent-example
>>>>>>> setup-ci:apps/atp-agent-example/README.md
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

<<<<<<< HEAD:apps/imageload-agent/README.md
Ensure you have the following environment variables set in your .env file:

```env
ANTHROPIC_API_KEY=your-anthropic-key
TOGETHER_API_KEY=your-together-key
SERVER_PORT="3000"
USE_OPENAI_EMBEDDING="TRUE"
OPENAI_API_KEY="sk-openai-api-key"
TWITTER_USERNAME=your_twitter_username
TWITTER_PASSWORD=your_twitter_password
```

## Feature

- **What it does:**

  ```plaintext
  This basically allows your agent to generate images and captions and post on Twitter daily by 12:00 PM
=======
Ensure you have the following environment variable set in your .env file:

```env
WALLET_PRIVATE_KEY=your-wallet-private-key
SERVER_PORT="3000"
USE_OPENAI_EMBEDDING="TRUE"
OPENAI_API_KEY="sk-openai-api-key"
TELEGRAM_BOT_TOKEN="bot-token"
```

## Query Examples

- **Sample Queries:**

  ```plaintext
  Check and post top agent, check my IQ balance then buy tokens using 1% of his IQ holdings
>>>>>>> setup-ci:apps/atp-agent-example/README.md
  ```

### More Queries: Try any combination of queries in the following doc

<<<<<<< HEAD:apps/imageload-agent/README.md
[Images Doc](https://brain.iqai.com/plugins/image-gen)
=======
[ATP Doc](https://brain.iqai.com/plugins/atp)
>>>>>>> setup-ci:apps/atp-agent-example/README.md
[Heartbeat Doc](https://brain.iqai.com/plugins/heartbeat)
