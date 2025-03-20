import SqliteAdapter from "@elizaos/adapter-sqlite";
import telegramPlugin from "@elizaos/client-telegram";
import twitterPlugin from "@elizaos/client-twitter";
import { ModelClass, generateText } from "@elizaos/core";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import createHeartbeatPlugin from "@iqai/plugin-heartbeat";
import createWikiPlugin from "@iqai/plugin-wiki";
import { SophiaCharacter } from "./character.ts";

async function main() {
	// Initialize plugins
	const pluginWiki = await createWikiPlugin();
	const heartbeat = await createHeartbeatPlugin([
		{
			clients: [
				{
					type: "telegram",
					chatId: process.env.TELEGRAM_CHAT_ID ?? "",
				},
				{
					type: "twitter",
				},
			],
			period: "0 */2 * * *",
			input:
				"get the latest user wikis from 0x8AF7a19a26d8FBC48dEfB35AEfb15Ec8c407f889 in past 2 hours and post about it",
			onlyFinalOutput: true,
			shouldPost: (response: string) => {
				return response.includes("https://iq.wiki/wiki/");
			},
			formatResponse: async (response, runtime) => {
				const prompt = `
				format the given original response in this form. do not use any markdown formatting and the message should always
				end with the link. also add emojis and you are a nerdy female wiki editor awkward and a degenerate. style the text like one and be witty.
				The original response is the wiki written by you so convey the message as its written by yourself.
				NOTE: ensure the response is below 280 characters and the link MUST be in the end. you can alter the wiki summary but make sure the link is not removed/truncated
				basic structure:
				# A random greeting (eg: Hello fellow nerds 🤓),
				# A single line conveying about new wiki with the wiki title
				# wiki summary
				# A witty joke/roast (optional/prefer crypto topics)
				# wiki link

				A proper example:
				Hey there, trivia fans 🤓,

				Check out my new wiki on Boxcat!

				Boxcat is a meme-tastic play-to-earn universe with epic storylines and interactive fun. Earn rewards just by tapping!

				Why did the meme go to school? To become a little more gif-ted!
			  https://iq.wiki/wiki/boxcat
			`;
				const context = `${prompt} original response: ${response}`;

				// Call generateText with the correct parameter structure
				const formattedText = await generateText({
					runtime: runtime,
					context: context,
					modelClass: ModelClass.LARGE,
				});

				return formattedText || response;
			},
		},
	]);
	// Build agent using builder pattern
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClients([telegramPlugin, twitterPlugin])
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([pluginWiki, heartbeat])
		.withCharacter(SophiaCharacter)
		.build();

	await agent.start();
}

main().catch(console.error);
