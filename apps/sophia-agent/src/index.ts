import SqliteAdapter from "@elizaos/adapter-sqlite";
import TelegramClient from "@elizaos/client-telegram";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import createHeartbeatPlugin from "@iqai/plugin-heartbeat";
import createWikiPlugin from "@iqai/plugin-wiki";
import { SophiaCharacter } from "./character.ts";
import createAtpPlugin from "@iqai/plugin-atp";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { elizaLogger } from "@elizaos/core";
import { DirectClientInterface } from "@elizaos/client-direct";
async function main() {
	// Initialize plugins
	const pluginWiki = await createWikiPlugin();
	const sequencer = await createSequencerPlugin();
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
			period: "*/20 * * * *",
			input: `
				GO THROUGH SEQUENCER AND FOLLOW THE BELOW INSTRUCTIONS.
				Step-1. Get all wiki activities by user 0x8AF7a19a26d8FBC48dEfB35AEfb15Ec8c407f889 in the past 20 minutes.
				Step-2. If any new wiki activity is found, generate a short announcement. Each announcement should be unique and slightly different in structure or style—avoid using the same template repeatedly. Vary greetings, sentence order, and phrasing to keep announcements fresh.
					For created wikis, the announcement must:
					- Clearly mention the wiki title and a brief summary (can be reworded, but must convey the main idea).
					- Include text indicating this is a newly created wiki.
					- Always end with the wiki link (never truncated or removed).
					- Be under 280 characters.
					- Not use markdown formatting.

					For edited wikis, the announcement must:
					- Clearly mention the wiki title and what was updated.
					- Include details about the changes (words changed, sections modified) when available.
					- Always end with the wiki link.
					- Be under 280 characters.
					- Not use markdown formatting.

					Examples for created wikis:
						1. New wiki published: Boxcat – a meme universe where you play, earn, and have fun. \n
							 🔗 Transaction: https://polygonscan.com/tx/0xcf46f119878f88ffbdb74b3c6c2d2be8b79ec2b1381ea6388b4ab70ed733d2d9 \n
							 🔗 Read more: https://iq.wiki/wiki/boxcat \n
						2. Just created: Boxcat wiki! Dive into the world of meme-powered rewards and interactive stories. \n
							 🔗 Transaction: https://polygonscan.com/tx/0xcf46f119878f88ffbdb74b3c6c2d2be8b79ec2b1381ea6388b4ab70ed733d2d9 \n
							 🔗 Details: https://iq.wiki/wiki/boxcat \n

					Examples for edited wikis:
						1. Wiki updated: Boxcat – with 52 new words and revisions to content and tags sections. \n
							 🔗 Transaction: https://polygonscan.com/tx/0xcf46f119878f88ffbdb74b3c6c2d2be8b79ec2b1381ea6388b4ab70ed733d2d9 \n
							 🔗 Read more: https://iq.wiki/wiki/boxcat \n
						2. Fresh updates to Boxcat wiki! Changes include new content sections and improved descriptions. \n
							 🔗 Transaction: https://polygonscan.com/tx/0xcf46f119878f88ffbdb74b3c6c2d2be8b79ec2b1381ea6388b4ab70ed733d2d9 \n
							 🔗 Details: https://iq.wiki/wiki/boxcat \n
				Step-3. Post the neatly worded announcement from step-2 (excluding the txn-link in the content) as a new log on the atp site to the agent ${process.env.AGENT_TOKEN_CONTRACT} with the provided polygonscan link as transaction link and chainId as 137.
					STRUCTURE THE COMMAND AS:
						Add log for the agent ${process.env.AGENT_TOKEN_CONTRACT} with the content:
						{INSERT THE ANNOUNCEMENT HERE}
						with transaction hash: {INSERT THE TRANSACTION HASH HERE}
						with chainId: 137
					IT IS IMPORTANT YOU MENTION THE TRANSACTION HASH AND CHAIN ID (ALWAYS 137) IN THE COMMAND.

					An example execution command to the tool would be:
					 Add log for the agent ${process.env.AGENT_TOKEN_CONTRACT} with the content as:
					 New wiki published: Boxcat – a meme universe where you play, earn, and have fun. Read more: https://iq.wiki/wiki/boxcat

					 with transaction hash: 0xcf46f119878f88ffbdb74b3c6c2d2be8b79ec2b1381ea6388b4ab70ed733d2d9
					 with chainId: 137
				Step-4. Return the announcement generated in step-2 finally.
				DO NOT HALLUCINATE AND ONLY RETURN THE ANNOUNCEMENT GENERATED IN STEP-2 CONTAINING THE WIKI LINK AND TXN LINK
			`,
			shouldPost: (response: string) => {
				elizaLogger.info("response: ", response);
				return response.includes("https://iq.wiki/wiki/");
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
		.withPlugins([pluginWiki, heartbeat, pluginAtp, sequencer])
		.withCharacter(SophiaCharacter)
		.build();

	await agent.start();
}

main().catch(console.error);
