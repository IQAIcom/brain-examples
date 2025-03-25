import SqliteAdapter from "@elizaos/adapter-sqlite";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import { createJsPlugin } from "@iqai/plugin-js";

async function main() {
	const jsPlugin = await createJsPlugin();

	const heartbeatPlugin = await createHeartbeatPlugin([
		{
			// Daily impermanent loss calculator
			period: "0 12 * * *",
			input: `Write and execute JavaScript code to:
        1. Create a function that calculates impermanent loss for liquidity providers
        2. Show the impermanent loss for different price change scenarios:
           - Price increases: 10%, 25%, 50%, 100%, 200%
           - Price decreases: 10%, 25%, 50%, 75%
        3. Calculate the required trading fees to offset the impermanent loss in each scenario
        4. Present the results in a clear, easy-to-understand format with explanations`,
			clients: [
				{
					type: "callback",
					callback: async (content) => {
						console.log("Daily Impermanent Loss Analysis:");
						console.log(content);
					},
				},
			],
		},
		{
			// Weekly DCA vs. lump sum comparison
			period: "0 0 * * 1",
			input: `Write and execute JavaScript code to:
        1. Compare dollar-cost averaging (DCA) vs. lump sum investing
        2. Simulate both strategies using the following parameters:
           - Initial investment: $10,000
           - DCA period: 10 weeks ($1,000 per week)
           - Simulate 3 market scenarios: bull (5% weekly growth), bear (3% weekly decline), and sideways (random ±2% weekly)
        3. Calculate final portfolio values, average entry prices, and total returns for each strategy
        4. Provide a simple visualization of the results using ASCII charts
        5. Explain the pros and cons of each approach based on the simulation results`,
			clients: [
				{
					type: "callback",
					callback: async (content) => {
						console.log("Weekly DCA vs. Lump Sum Comparison:");
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
