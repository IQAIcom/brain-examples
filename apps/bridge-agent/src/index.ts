import SqliteAdapter from "@elizaos/adapter-sqlite";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createIQBridgeMonitorPlugin } from "../src/bridge-plugin/index.ts";
import telegramPlugin from "@elizaos/client-telegram";

async function main() {
	const iqBridgeMonitorPlugin = await createIQBridgeMonitorPlugin({
		funderPrivateKey: process.env.WALLET_PRIVATE_KEY as string,
		tgChatId: process.env.TELEGRAM_CHAT_ID as string,
	});

	// Create agent with plugin.
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClient(telegramPlugin)
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
