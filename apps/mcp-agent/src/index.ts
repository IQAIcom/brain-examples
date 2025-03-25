import SqliteAdapter from "@elizaos/adapter-sqlite";
import { DirectClientInterface } from "@elizaos/client-direct";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createMcpPlugin } from "@iqai/plugin-mcp";

async function main() {
	const pluginMcp = await createMcpPlugin({
		mode: "stdio",
		command: "uvx",
		args: ["cryo-mcp", "--rpc-url", "http://localhost:8545"],
	});
	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClient(DirectClientInterface)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugin(pluginMcp)
		.withCharacter({
			name: "BrainBot mcp",
			bio: "You are BrainBot, a bot that can use mcp servers",
			username: "brainbot",
			messageExamples: [],
			plugins: [pluginMcp],
			lore: ["Created to assist users with mcp server"],
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
