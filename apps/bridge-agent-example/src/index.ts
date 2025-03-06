import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import DirectClientInterface from "@elizaos/client-direct";
import Database from "better-sqlite3";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import {
	AgentBuilder,
	ModelProviderName,
	createSimplePlugin,
} from "@iqai/agent";
import * as fs from "node:fs";
import * as path from "node:path";
import { createIQBridgeMonitorPlugin } from "../src/bridge-plugin/index.ts";

async function main() {
	const iqBridgeMonitorPlugin = await createIQBridgeMonitorPlugin({
		funderPrivateKey: process.env.WALLET_PRIVATE_KEY,
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
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([bootstrapPlugin, iqBridgeMonitorPlugin])
		.withCharacter({
			name: "bridge helper",
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
