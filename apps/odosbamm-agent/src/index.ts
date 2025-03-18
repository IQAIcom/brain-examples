import SqliteAdapter from "@elizaos/adapter-sqlite";
import DirectClient from "@elizaos/client-direct";
import TelegramClient from "@elizaos/client-telegram";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createBAMMPlugin } from "@iqai/plugin-bamm";
import { createOdosPlugin } from "@iqai/plugin-odos";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { fraxtal } from "viem/chains";

async function main() {
	// Initialize BAMM plugin
	const bammPlugin = await createBAMMPlugin({
		walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
		chain: fraxtal,
	});

	// Initialize Odos plugin
	const odosPlugin = await createOdosPlugin({
		chain: fraxtal,
		walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
	});

	// Initialize Sequencer plugin
	const sequencerPlugin = await createSequencerPlugin();

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withClients([DirectClient, TelegramClient])
		.withPlugins([bammPlugin, bootstrapPlugin, sequencerPlugin, odosPlugin])
		.withCharacter({
			name: "BrainBot SwapLender",
			bio: "You are BrainBot, a helpful assistant in swapping and borrowing.",
			username: "brainbot",
			messageExamples: [],
			lore: ["Created to assist users with swapping and borrowing"],
			style: {
				all: ["Professional"],
				chat: ["Friendly"],
				post: ["Clear"],
			},
		})
		.build();

	await agent.start();
}

main().catch(console.error);
