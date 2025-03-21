# ATP Agent

## Overview

The **ATP Agent** the agent use heartbeat plugin to check top agents daily and buy tokens using 1% of his IQ holdings on fraxtal, this is done with addition of a simple custom plugin ie **iqBalancePlugin**

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

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/atp-agent
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
SERVER_PORT="3000"
USE_OPENAI_EMBEDDING="TRUE"
OPENAI_API_KEY="sk-openai-api-key"
```

## Query Examples

- **Sample Queries:**

  ```plaintext
  Use sequencer to get top ATP agent, buy with 1% IQ if within -5%, sell if +10%, else buy with 1% IQ.
  ```

## Results

You can checkout the video of the ATP Agent in action
[Video 1](https://res.cloudinary.com/dyhwugvrd/video/upload/v1742490853/ATP_Agent_Vid_ywnlmr.webm)
[Video 2](https://res.cloudinary.com/dyhwugvrd/video/upload/v1742490852/ATP_Recording_r1whba.webm)

You can check transaction logs url
[Transaction Logs](https://fraxscan.com/txs?a=0xE16159317691fe9C9e764db7896698c26DBfc71c)

### More Queries: Try any combination of queries in the following doc

[ATP Doc](https://brain.iqai.com/plugins/atp)
[Heartbeat Doc](https://brain.iqai.com/plugins/heartbeat)
