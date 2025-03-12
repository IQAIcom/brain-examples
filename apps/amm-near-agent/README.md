# 🤖 AMM Near Agent Example

This repository contains a practical example of AI integration with the NEAR blockchain protocol, specifically an Automated Market Maker (AMM) agent. This examples uses the [Brain Near Plugin](https://brain.iqai.com/plugins/near) to interact with the NEAR blockchain.

## ❓ What is the AMM Near Agent?

The AMM Near Agent is a specialized AI agent that facilitates trading between two assets on the NEAR Protocol. It works with the [AMM Near Contract](https://github.com/zavodil/ai-amm) to provide automated price calculations for token swaps.

### ⚙️ How It Works

1. A user initiates a token swap via the smart contract
2. The contract interrupts the transaction and delegates output calculation to the NEAR AI agent
3. The agent processes swap details, performs calculations, and responds to the contract
4. The contract resumes the transaction, finalizes the swap, and transfers tokens to the user

## 🚀 Running This Example

### 📋 Prerequisites

- Node.js (v23)
- pnpm package manager
- NEAR account and access to NEAR testnet

### 💾 Installation

```sh
# Clone the repository
git clone https://github.com/IQAIcom/brain-examples.git

# Navigate to the AMM Near Agent directory
cd brain-examples/apps/amm-near-agent

# Install dependencies
pnpm install
```

### ⚙️ Configuration

Create a `.env` file in the `apps/amm-near-agent` directory with the following variables:

```
NEAR_ACCOUNT_ID=your-testnet-account.testnet
NEAR_PRIVATE_KEY=your-private-key
```

### ▶️ Running the Agent

```sh
# Start the AMM Near Agent
pnpm run start
```

## 🔍 Example Transactions

We've deployed the NEAR contract on mainnet, which you can view at [https://nearblocks.io/address/amm-iqai.near](https://nearblocks.io/address/amm-iqai.near). Here are some example transactions:

- [Creating new pool for USDT and wNEAR](https://nearblocks.io/txns/ADq5gcUy6DKLoFcFgCc9ged9S1eD6KiNhRfYXSHuR1kC)
- [Swap USDT with wNEAR](https://nearblocks.io/txns/Doz8W9sJQ2wgvGeAHwYYmULLsjeiHrvFHXSRhi8K91Rq#execution#5g4KuV8HR6z8DZW8k3gXSJ9Np5JcevsZC84sv1kNGxBd)
- [Agent response to the swap transaction](https://nearblocks.io/txns/CJ7Vb9Pvm7gGjruF9PdS3DB9K5gYFqorqUG3koWgX8ao)
- [FT Transfer](https://nearblocks.io/txns/QXQUMTMKmYH9L55HzWygb9oYnzUyUcpA9jCduvVaxA9#execution#ACuByCKyJ3qhFJCcK7JBv74usyGYAcqb5Skf8pgxiqvp)


## 📚 Additional Resources
- [Brain Near Plugin](https://brain.iqai.com/plugins/near)
- [NEAR Protocol Documentation](https://docs.near.org/docs/develop/basics/create-account)
- [Setting up a NEAR account](https://docs.near.org/docs/develop/basics/create-account)
- [AMM Near Contract Repository](https://github.com/zavodil/ai-amm)
