import SqliteAdapter from "@elizaos/adapter-sqlite";
import TelegramClient from "@elizaos/client-telegram";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import createHeartbeatPlugin from "@iqai/plugin-heartbeat";
import createWikiPlugin from "@iqai/plugin-wiki";
import { SophiaCharacter } from "./character.ts";
import createAtpPlugin from "@iqai/plugin-atp";
import { elizaLogger, type IAgentRuntime } from "@elizaos/core";
import { DirectClientInterface } from "@elizaos/client-direct";
import { processWikiActivity } from "./utils.ts";

async function main() {
	// Initialize plugins
	const pluginWiki = await createWikiPlugin();
	const pluginAtp = await createAtpPlugin({
		apiKey: process.env.ATP_API_KEY as string,
	});
	const heartbeat = await createHeartbeatPlugin([
		{
			clients: [
				{
					type: "telegram",
					chatId: process.env.TELEGRAM_CHAT_ID as string,
				},
			],
			period: "*/10 * * * *",
			input:
				"Get all wiki activities by user 0x8AF7a19a26d8FBC48dEfB35AEfb15Ec8c407f889 in the past 10 minutes.",
			onlyFinalOutput: true,
			shouldPost: (response: string) => {
				elizaLogger.info("response: ", response);
				return response.includes("https://iq.wiki");
			},
			formatResponse: async (response: string, runtime: IAgentRuntime) => {
				const wikiPattern = /📜 Wiki (Created|Edited)[\s\S]*?(?=📜 Wiki|\Z)/g;
				const wikiActivities = response.match(wikiPattern) || [];

				if (wikiActivities.length === 0) {
					if (
						response.includes("Wiki") &&
						response.includes("Source: https://iq.wiki")
					) {
						await processWikiActivity(response, runtime);
					}
					return response;
				}

				elizaLogger.info(
					`Found ${wikiActivities.length} wiki activities to process`,
				);

				// Process each wiki activity in sequence
				for (const activity of wikiActivities) {
					try {
						await processWikiActivity(activity, runtime);
					} catch (error) {
						elizaLogger.error(
							`Error processing wiki activity: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				return response;
			},
		},
	]);

	// Build agent using builder pattern
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClients([TelegramClient, DirectClientInterface])
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([pluginWiki, heartbeat, pluginAtp])
		.withCharacter(SophiaCharacter)
		.build();

	await agent.start();
}

main().catch(console.error);
