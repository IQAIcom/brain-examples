# Near Agent Example

The **Near Agent Example** provides a seamless integration with the NEAR Protocol blockchain, enabling smart contract interactions, transaction handling, and event listening capabilities directly from your agent.

## Plugins Overview

The **Near Plugin** provides a seamless integration with the NEAR Protocol blockchain, enabling smart contract interactions, transaction handling, and event listening capabilities directly from your agent.

### Heartbeat Plugin

The **Heartbeat** Plugin enables automated scheduling of tasks and social media interactions.

### Image Plugin

The **Near Plugin** provides a seamless integration with the NEAR Protocol blockchain, enabling smart contract interactions, transaction handling, and event listening capabilities directly from your agent.

### Heartbeat Plugin

The **Heartbeat** Plugin enables automated scheduling of tasks and social media interactions.

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/near-agent-example
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
SERVER_PORT="3000"
USE_OPENAI_EMBEDDING="TRUE"
OPENAI_API_KEY="sk-openai-api-key"
NEAR_ACCOUNT_ID=your_near_account_id
NEAR_PRIVATE_KEY=your_near_private_key
```

## Feature

- **What it does:**

  ```plaintext
  This basically allows your agent to generate images and captions and post on Twitter daily by 12:00 PM
  ```

### More Queries: Try any combination of queries in the following doc

[Near Doc](https://brain.iqai.com/plugins/near)
