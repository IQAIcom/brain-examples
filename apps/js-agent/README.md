# JS Agent

## Overview

The **JS Agent** demonstrates the power of executing JavaScript code within an AI agent environment. This agent uses the JS plugin to perform crypto-related calculations and analysis without requiring external API calls.

## Plugins Overview

### JS Plugin

The **JS Plugin** allows the agent to:

- Write and execute JavaScript code in a sandboxed environment
- Perform complex calculations and simulations
- Generate visualizations using ASCII charts
- Return formatted results to users

### Heartbeat Plugin

The **Heartbeat Plugin** enables automated scheduling of tasks:

- Runs calculations on a predefined schedule
- Outputs results to the console or other configured clients
- Maintains consistent analysis without user intervention

## Key Features

This agent specializes in crypto fundamentals and calculations:

1. **Impermanent Loss Analysis**:
   - Calculates impermanent loss for different price change scenarios
   - Determines required trading fees to offset losses
   - Presents results in an easy-to-understand format

2. **Investment Strategy Comparison**:
   - Simulates DCA vs. lump sum investing across market conditions
   - Calculates performance metrics for each strategy
   - Visualizes results using ASCII charts
   - Provides strategic insights based on simulation results

3. **On-Demand Calculations**:
   - Staking reward projections
   - Compound interest calculations
   - Risk/reward analysis
   - Break-even calculations

## Setup

To get started, clone this repository and navigate to the project folder:

```bash
git clone https://github.com/IQAIcom/brain-examples.git
cd brain-examples/apps/js-agent
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

## Query Examples

- **Sample Queries:**

  ```plaintext
  Calculate impermanent loss if ETH price changes by 50%
  ```

  ```plaintext
  If I stake 5000 USDC at 5.2% APY, how much will I earn in 3 months?
  ```

  ```plaintext
  Compare DCA vs lump sum for $5000 over 5 weeks in a bull market
  ```

## Results

The JS Agent can produce detailed calculations and analysis, such as:

```bash
Impermanent Loss Analysis:
Price Change: +50%
Impermanent Loss: -2.02%
Required Fee APY to Break Even: 7.37%

For a $10,000 position, that's a loss of $202 compared to holding.
```

```bash
Staking 5000 USDC at 5.2% APY for 3 months:
Final amount: 5065.00 USDC
Total interest earned: 65.00 USDC
Effective interest rate for period: 1.30%
```

### More Queries

Try any combination of crypto calculation queries. The agent can handle:

- Compound interest calculations
- Token conversion estimates
- Risk/reward analysis
- Break-even calculations
- Investment strategy simulations

## Documentation

For more information about the plugins used in this example:

- [JS Plugin Documentation](https://brain.iqai.com/plugins/js)
- [Heartbeat Plugin Documentation](https://brain.iqai.com/plugins/heartbeat)
