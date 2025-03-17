import DirectClientInterface from "@elizaos/client-direct";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { SqliteDatabaseAdapter } from "@iqai/adapter-sqlite";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import createSequencerPlugin from "@iqai/plugin-sequencer";

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
			period: "0 12 * * *", // Every day at 12:00 PM
			input: "Post an AI Cat photo  daily",
			client: "twitter",
		},
	]);

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
		.withPlugins([bootstrapPlugin, heartbeatPlugin, sequencerPlugin])
		.withCharacter({
			name: "BrainBot ImageLoader",
			bio: "You are BrainBot, a helpful assistant in posting daily images on twitter.",
			username: "brainbot",
			messageExamples: [],
			lore: ["Created to assist users with magnificent photos"],
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
