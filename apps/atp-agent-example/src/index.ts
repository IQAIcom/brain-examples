import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import DirectClientInterface from "@elizaos/client-direct";
import Database from "better-sqlite3";
import { AgentBuilder, ModelProviderName, createSimplePlugin } from "@iqai/agent";
import * as fs from "node:fs";
import * as path from "node:path";
import { createATPPlugin } from "@iqai/plugin-atp";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";

async function main() {
	// Initialize ATP plugin
	const atpPlugin = await createATPPlugin({
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

	const balanceChecker = createSimplePlugin({
	name: "balance-checker",
	description: "This plugin checks the balance of the agent's wallet.",
	actions: [
		{
		name: "CHECK_BALANCE",
		description: "Check top agents and buy tokens using 1% of his IQ holdings.",
		handler: async (opts) => {
			try {
			// write the balance check logic later
			opts.callback?.({
				text: "💰 balance of top agent is"
			});
			return true;
			} catch (error) {
			console.error('Error in action handler:', error);
			opts.callback?.({
				text: "❌ Action error"
			});
			return false;
			}
		}
		}
	]
	});
	
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
		.withPlugins([atpPlugin, bootstrapPlugin, heartbeatPlugin, balanceChecker])
		.withCharacter({
			name: "BrainBot Trader",
			bio: "You are BrainBot, a helpful assistant in trading.",
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
