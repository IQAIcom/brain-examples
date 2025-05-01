import SqliteAdapter from "@elizaos/adapter-sqlite";
import DirectClient from "@elizaos/client-direct";
import TelegramClient from "@elizaos/client-telegram";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createFraxlendPlugin } from "@iqai/plugin-fraxlend";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { fraxtal } from "viem/chains";

async function main() {
	// Initialize FraxLend plugin
	const fraxlendPlugin = await createFraxlendPlugin({
		chain: fraxtal,
		walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
	});

	// Initialize Sequencer plugin
  	const sequencerPlugin = await createSequencerPlugin();

	// Initialize Heartbeat plugin
	const heartbeatPlugin = await createHeartbeatPlugin([
		{
			period: "0 12 * * *",
			input:
				"Use sequencer to Check if APR of new pools are greater 3% of his current positions then lend else borrow",
			clients: [
				{
					type: "callback",
					callback: async (data: any) => {
						// Handle the callback data here
						console.log("Callback data:", data);
					}
					
				},
			],
		},
	]);

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClient(DirectClient)
		.withClient(TelegramClient)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([fraxlendPlugin, bootstrapPlugin, heartbeatPlugin, sequencerPlugin])
		.withCharacter({
			name: "BrainBot Lender",
			bio: "You are BrainBot, a helpful assistant in lending.",
			username: "brainbot",
			messageExamples: [],
			lore: [],
			style: {
				all: [],
				chat: [],
				post: [],
			},
		})
		.build();

	await agent.start();
}

main().catch(console.error);
