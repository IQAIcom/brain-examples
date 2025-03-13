import * as fs from "node:fs";
import * as path from "node:path";
import DirectClientInterface from "@elizaos/client-direct";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { SqliteDatabaseAdapter } from "@iqai/adapter-sqlite";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import Database from "better-sqlite3";
import { createIQBridgeMonitorPlugin } from "../src/bridge-plugin/index.ts";

async function main() {
	const iqBridgeMonitorPlugin = await createIQBridgeMonitorPlugin({
		funderPrivateKey: process.env.WALLET_PRIVATE_KEY as string,
	});
	// Setup database
	const databaseAdapter = new SqliteDatabaseAdapter();

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
