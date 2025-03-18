import SqliteAdapter from "@elizaos/adapter-sqlite";
import DirectClient from "@elizaos/client-direct";
import { TelegramClientInterface } from "@elizaos/client-telegram";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createFraxlendPlugin } from "@iqai/plugin-fraxlend";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import { fraxtal } from "viem/chains";

async function main() {
	// Initialize FraxLend plugin
	const fraxlendPlugin = await createFraxlendPlugin({
		chain: fraxtal,
		walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
	});

	// Initialize Heartbeat plugin
	const heartbeatPlugin = await createHeartbeatPlugin([
		{
			period: "0 12 * * *", // Every day at 12:00 PM
			input:
				"Check if APR of new pools are greater 3% of his current positions, lend else borrow and show result",
			client: "telegram",
			config: {
				chatId: process.env.TELEGRAM_CHAT_ID as string,
			},
		},
	]);

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClient(DirectClient)
		.withClient("telegram", TelegramClientInterface)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([fraxlendPlugin, bootstrapPlugin, heartbeatPlugin])
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
