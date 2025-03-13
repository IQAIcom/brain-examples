import * as fs from "node:fs";
import * as path from "node:path";
import DirectClientInterface from "@elizaos/client-direct";
import { ModelProviderName } from "@elizaos/core";
import { SqliteDatabaseAdapter } from "@iqai/adapter-sqlite";
import { AgentBuilder } from "@iqai/agent";
import Database from "better-sqlite3";

async function main() {
	// Setup database
	const databaseAdapter = new SqliteDatabaseAdapter();

	// Build agent using builder pattern
	const agent = new AgentBuilder()
		.withDatabase(databaseAdapter)
		.withClient("direct", DirectClientInterface)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withCharacter({
			name: "BrainBot",
			bio: "You are BrainBot, a helpful assistant.",
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
