import SqliteAdapter from "@elizaos/adapter-sqlite";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import { createJsPlugin } from "@iqai/plugin-js";

async function main() {
	// Initialize JS plugin for code execution
	const jsPlugin = await createJsPlugin();

	// Initialize Heartbeat plugin with scheduled financial math tasks
	const heartbeatPlugin = await createHeartbeatPlugin([
		{
			// Daily options pricing calculation
			period: "0 12 * * *",
			input: `Write and execute JavaScript code to:
        1. Implement the Black-Scholes model for options pricing
        2. Calculate option prices for a hypothetical crypto option with:
           - Current price: $2,000
           - Strike prices: [$1,800, $2,000, $2,200]
           - Time to expiration: 30 days
           - Volatility: 80% (annualized)
           - Risk-free rate: 3%
        3. Calculate the Greeks (Delta, Gamma, Theta, Vega)
        4. Present the results in a clear, tabular format`,
			clients: [
				{
					type: "callback",
					callback: async (content) => {
						console.log("Daily Options Pricing Analysis:");
						console.log(content);
					},
				},
			],
		},
		{
			// Weekly Monte Carlo simulation
			period: "0 0 * * 1",
			input: `Write and execute JavaScript code to:
        1. Implement a Monte Carlo simulation for price prediction
        2. Assume a starting price of $2,000
        3. Use a geometric Brownian motion model with:
           - Annual volatility: 70%
           - Annual drift: 5%
           - 10,000 simulation paths
           - 30-day forecast
        4. Calculate the probability of price exceeding $2,500 within 30 days
        5. Generate statistics on expected price distribution
        6. Return detailed results with confidence intervals`,
			clients: [
				{
					type: "callback",
					callback: async (content) => {
						console.log("Weekly Monte Carlo Simulation:");
						console.log(content);
					},
				},
			],
		},
		{
			// Monthly portfolio optimization
			period: "0 0 1 * *",
			input: `Write and execute JavaScript code to:
        1. Implement a Markowitz portfolio optimization model
        2. Use the following assets with their expected returns and volatilities:
           - Asset A: 10% annual return, 60% volatility
           - Asset B: 5% annual return, 30% volatility
           - Asset C: 15% annual return, 80% volatility
        3. Correlation matrix:
           - A-B: 0.3
           - A-C: 0.7
           - B-C: 0.2
        4. Calculate the efficient frontier (10 points)
        5. Identify the minimum variance portfolio and maximum Sharpe ratio portfolio
        6. Return detailed allocation recommendations with risk/return metrics`,
			clients: [
				{
					type: "callback",
					callback: async (content) => {
						console.log("Monthly Portfolio Optimization:");
						console.log(content);
					},
				},
			],
		},
	]);

	// Create agent with plugins
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([jsPlugin, heartbeatPlugin])
		.withCharacter({
			name: "QuantBot",
			bio: "I'm a quantitative finance specialist that can write and execute JavaScript code to perform complex financial calculations, risk modeling, and portfolio optimization.",
			username: "quantbot",
			style: {
				all: ["Technical", "Precise"],
				chat: ["Educational", "Thorough"],
				post: ["Analytical", "Data-driven"],
			},
		})
		.build();

	await agent.start();
}

main().catch(console.error);
