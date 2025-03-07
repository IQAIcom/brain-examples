import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import DirectClientInterface from "@elizaos/client-direct";
import Database from "better-sqlite3";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import * as fs from "node:fs";
import * as path from "node:path";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";

import createNearPlugin from "@iqai/plugin-near";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { TwitterClientInterface } from "@elizaos/client-twitter";

async function main() {

	// Initialize the Near
	const nearPlugin = await createNearPlugin({
		accountId: process.env.NEAR_ACCOUNT_ID as string,
		accountKey: process.env.NEAR_PRIVATE_KEY,
		listeners: [
		{
			eventName: "run_agent",
			contractId: "your-contract.testnet",
			responseMethodName: "agent_response",
			handler: async (payload, { account }) => {
			// Custom event handling logic
			return "result";
			},
		}
		],
		networkConfig: {
		networkId: "testnet", // or "mainnet"
		nodeUrl: "https://test.rpc.fastnear.com",
		},
	});

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
		.withClient("twitter", TwitterClientInterface)
		.withModelProvider(
		ModelProviderName.OPENAI,
		process.env.OPENAI_API_KEY as string
		)
		.withPlugins([nearPlugin, bootstrapPlugin, sequencerPlugin])
		.withCharacter({
			name: "BrainBot ImageLoader",
			bio: "You are BrainBot, a helpful assistant in posting daily images on twitter.",
			username: "brainbot",
			messageExamples: [],
			lore: ["Created to assist users with magnificent photos"],
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
