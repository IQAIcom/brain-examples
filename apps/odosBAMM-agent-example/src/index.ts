import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import DirectClientInterface from "@elizaos/client-direct";
import { TelegramClientInterface } from "@elizaos/client-telegram";
// import { DiscordClientInterface } from "@elizaos/client-discord";
import Database from "better-sqlite3";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import * as fs from "node:fs";
import * as path from "node:path";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { createOdosPlugin } from "@iqai/plugin-odos";
import { createBAMMPlugin } from '@iqai/plugin-bamm';
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
	
	// Setup database
	const dataDir = path.join(process.cwd(), "./data");
	fs.mkdirSync(dataDir, { recursive: true });
	const dbPath = path.join(dataDir, "db.sqlite");
	const databaseAdapter = new SqliteDatabaseAdapter(new Database(dbPath));

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(databaseAdapter)
		.withClient("direct", DirectClientInterface)
		.withClient("telegram", TelegramClientInterface)
		// .withClient("discord", DiscordClientInterface)
		.withModelProvider(
		ModelProviderName.OPENAI,
		process.env.OPENAI_API_KEY as string
		)
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
				post: ["Clear"]
			},
		})
		.build();

  		await agent.start();
}

main().catch(console.error);
