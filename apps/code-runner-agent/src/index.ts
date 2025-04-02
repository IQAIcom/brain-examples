import SqliteAdapter from "@elizaos/adapter-sqlite";
import { DirectClientInterface } from "@elizaos/client-direct";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createMcpPlugin } from "@iqai/plugin-mcp";

async function main() {
	const codeRunnerPlugin = await createMcpPlugin({
		name: "code-runner",
		description: "Run code on mcp server",
		transport: {
			mode: "stdio",
			command: "npx",
			args: ["-y", "mcp-server-code-runner@latest"],
		},
		disableToolChaining: true,
	});

	// Create agent with plugins
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClient(DirectClientInterface)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugin(codeRunnerPlugin)
		.withCharacter({
			name: "CodeRunner",
			bio: "I'm a code execution specialist that can write and run code to help solve programming problems and demonstrate solutions.",
			username: "coderunner",
			style: {
				all: ["Technical", "Helpful"],
				chat: ["Instructive", "Clear"],
				post: ["Practical", "Solution-oriented"],
			},
		})
		.build();

	await agent.start();
}

main().catch(console.error);
