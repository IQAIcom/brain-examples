import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import DirectClientInterface from "@elizaos/client-direct";
import Database from "better-sqlite3";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import * as fs from "node:fs";
import * as path from "node:path";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";

import { createFraxlendPlugin } from "@iqai/plugin-fraxlend";
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
		period: "0 12 * * *",  // Every day at 12:00 PM
		input: "Post a crypto market update",
		client: "telegram",
		config: {
			chatId: process.env.TELEGRAM_CHAT_ID as string
		}
	}
	]);
	
	// Setup database
	const dataDir = path.join(process.cwd(), "./data");
	fs.mkdirSync(dataDir, { recursive: true });
	const dbPath = path.join(dataDir, "db.sqlite");
	const databaseAdapter = new SqliteDatabaseAdapter(new Database(dbPath));

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(databaseAdapter)
		.withClient("direct", DirectClientInterface)
		.withModelProvider(
		ModelProviderName.OPENAI,
		process.env.OPENAI_API_KEY as string
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
