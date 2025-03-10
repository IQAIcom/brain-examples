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

## 📚 Additional Resources
- [Brain Near Plugin](https://brain.iqai.com/plugins/near)
- [NEAR Protocol Documentation](https://docs.near.org/docs/develop/basics/create-account)
- [Setting up a NEAR account](https://docs.near.org/docs/develop/basics/create-account)
- [AMM Near Contract Repository](https://github.com/zavodil/ai-amm)
