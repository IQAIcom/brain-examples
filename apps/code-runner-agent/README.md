# Code Runner Agent

The **Code Runner Agent** is  designed to execute code and return results to users. It supports [multiple](https://github.com/formulahendry/mcp-server-code-runner/blob/main/src/constants.ts) programming languages and provides a sandboxed environment for secure execution.

This agent uses the MCP plugin to execute the code via the [code runner mcp server](https://github.com/formulahendry/mcp-server-code-runner)

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/code-runner-agent
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
USE_OPENAI_EMBEDDING="TRUE"
OPENAI_API_KEY="sk-openai-api-key"
```
