# ImageLoad Agent Example

## Overview

The **ImageLoad Agent Example** integrates multiple plugins to enable your agent generate images and captions, and post them on a daily basis.

## Plugins Overview

### Image Plugin

The **Image Plugin** allows your agent to generate AI images using Anthropic and Together services, with automatic captions generation.

### Heartbeat Plugin

The **Heartbeat** Plugin enables automated scheduling of tasks and social media interactions.

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/imageload-agent-example
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
  ```

### More Queries: Try any combination of queries in the following doc

[Images Doc](https://brain.iqai.com/plugins/image-gen)
[Heartbeat Doc](https://brain.iqai.com/plugins/heartbeat)
