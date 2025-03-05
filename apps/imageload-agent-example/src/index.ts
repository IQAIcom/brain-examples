import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import DirectClientInterface from "@elizaos/client-direct";
import Database from "better-sqlite3";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import * as fs from "node:fs";
import * as path from "node:path";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";

import { imageGenerationPlugin } from "@elizaos/plugin-image-generation";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { TwitterClientInterface } from "@elizaos/client-twitter";

async function main() {

	// Initialize Image plugin
	// const imagePlugin = imageGenerationPlugin({
	// 	provider: "anthropic",
	// 	apiKey: process.env.ANTHROPIC_API_KEY,
	// 	defaultSize: "1024x1024",
	// 	autoCaption: true
	//   });

	  const sequencerPlugin = await createSequencerPlugin();

	// Initialize Heartbeat plugin
	const heartbeatPlugin = await createHeartbeatPlugin([
		{
			period: "0 12 * * *",  // Every day at 12:00 PM
			input: "Post an AI Cat photo  daily",
			client: "twitter",
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
		.withClient("twitter", TwitterClientInterface)
		.withModelProvider(
		ModelProviderName.OPENAI,
		process.env.OPENAI_API_KEY as string
		)
		.withPlugins([imagePlugin, bootstrapPlugin, heartbeatPlugin, sequencerPlugin])
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
