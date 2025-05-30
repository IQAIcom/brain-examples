import SqliteAdapter from "@elizaos/adapter-sqlite";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createIQBridgeMonitorPlugin } from "../src/bridge-plugin/index.ts";
import TelegramClient from "@elizaos/client-telegram";
import createAtpPlugin from "@iqai/plugin-atp";
import { DirectClientInterface } from "@elizaos/client-direct";

async function main() {
	const iqBridgeMonitorPlugin = await createIQBridgeMonitorPlugin({
		funderPrivateKey: process.env.WALLET_PRIVATE_KEY as string,
		tgChatId: process.env.TELEGRAM_CHAT_ID as string,
		agentTokenContract: process.env.AGENT_TOKEN_CONTRACT as string,
	});
	const atpPlugin = await createAtpPlugin({
		walletPrivateKey: "not-needed",
		apiKey: process.env.ATP_API_KEY as string,
	});
	// Create agent with plugin.
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClients([TelegramClient, DirectClientInterface])
		.withModelProvider(
			ModelProviderName.GOOGLE,
			process.env.GOOGLE_API_KEY as string,
		)
		.withPlugins([iqBridgeMonitorPlugin, atpPlugin])
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
