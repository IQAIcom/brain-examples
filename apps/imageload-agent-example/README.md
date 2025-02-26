# odosBAMM Agent Example

## Overview

The **ImageLoader Agent Example** integrates multiple plugins to enable your agent generate images and captions, and post them on daily basis.

## Plugins Overview

### Image Plugin

The **Image Plugin** allows your agent to generate AI images using Anthropic and Together services, with automatic caption generation.

### Heartbeat Plugin

The **Heartbeat** Plugin enables automated scheduling of tasks and social media interactions

## Installation

Ensure all required packages are installed by running:

```bash
pnpm install
```

If any packages are missing, install them using:

```bash
pnpm add @elizaos/client-twitter @elizaos/core @iqai/plugin-heartbeat @eliza/plugin-image-generation @iqai/agent @iqai/plugin-sequencer @eliza/plugin-bootstrap @elizaos/adapter-sqlite @elizaos/client-direct node:path node:fs
```

To run the agent, open a terminal in your project directory and execute:

```bash
pnpm dev
```

Ensure you have the following environment variable set in your .env file:

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
  This basically allows your agent to generate images and caption and post on Twitter daily by 12:00pm
  ```

### More Queries: try any combination of queires in the following doc

[Images Doc] (https://brain.iqai.com/plugins/image-gen)
[Heartbeat Doc] (https://brain.iqai.com/plugins/heartbeat)
