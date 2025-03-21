import SqliteAdapter from "@elizaos/adapter-sqlite";
import DirectClient from "@elizaos/client-direct";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import imageGenerationPlugin from "@elizaos/plugin-image-generation";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import createSequencerPlugin from "@iqai/plugin-sequencer";

async function main() {
	const sequencerPlugin = await createSequencerPlugin();

	// Initialize Heartbeat plugin
	const heartbeatPlugin = await createHeartbeatPlugin([
		{
			period: "0 12 * * *",
			input: "Post an AI Cat photo  daily",
			clients: [
				{
					type: "twitter",
				},
			],
		},
	]);

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClient(DirectClient)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([
			bootstrapPlugin,
			heartbeatPlugin,
			sequencerPlugin,
			imageGenerationPlugin,
		])
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
