# MCP Agent

## Overview

The **MCP Agent** leverages the Model Context Protocol (MCP) to connect with different MCP servers, providing a flexible interface for interacting with various data sources and services. This agent demonstrates how to integrate multiple MCP servers to extend AI agent capabilities.

## Plugins Overview

### MCP Plugin

The **MCP Plugin** enables connection to MCP-compatible servers, allowing the agent to:

- Interact with blockchain data through the Cryo-mcp server
- Access filesystem resources through the file-system MCP server
- Route requests to the appropriate MCP server based on context

Each MCP server provides specialized functionality:

- **Cryo-mcp**: Connects to a local blockchain node for retrieving and processing on-chain data
- **File-system**: Provides secure, controlled access to specified filesystem directories

The cryo mcp and the file-system server both go hand in hand with the mcp plugin. The file responses from the cryo mcp server are then passed to the file system server for processing. This is automatically handled by the mcp plugin via tool chaining

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/mcp-agent
```

Then, follow the installation instructions below.

## Installation

Ensure all required packages are installed by running:

```bash
pnpm install
```

Make sure you have the following prerequisites:

- Node.js v18 or higher
- uvx installed for Cryo-mcp
- Appropriate filesystem permissions for the file-system MCP server

Configure your environment variables in a `.env` file:

```env
USE_OPENAI_EMBEDDING="TRUE"
OPENAI_API_KEY="sk-openai-api-key"
```

To run the agent, execute:

```bash
pnpm dev
```

## Use Cases

- **Blockchain Analysis**: Retrieve and analyze on-chain data without leaving your chat interface
- **File Management**: Access and manipulate files through natural language commands
- **Cross-Service Workflows**: Create workflows that span across blockchain and filesystem resources
