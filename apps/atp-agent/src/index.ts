import SqliteAdapter from "@elizaos/adapter-sqlite";
import {
	AgentBuilder,
	ModelProviderName,
	createSimplePlugin,
} from "@iqai/agent";
import { createAtpPlugin } from "@iqai/plugin-atp";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { http, createPublicClient } from "viem";
import { erc20Abi } from "viem";
import { fraxtal } from "viem/chains";
import TelegramClient from "@elizaos/client-telegram";
import { DirectClientInterface } from "@elizaos/client-direct";

const IQ_TOKEN_ADDRESS = "0x6EFB84bda519726Fa1c65558e520B92b51712101";

async function main() {
	// Initialize ATP plugin.
	const atpPlugin = await createAtpPlugin({
		walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
	});

	const sequencerPlugin = await createSequencerPlugin();

	// Initialize Heartbeat plugin
	const heartbeatPlugin = await createHeartbeatPlugin([
		{
			period: "0 */3 * * *", // Every 3 hours
			input: `
				Use sequencer to get top ATP agents, then pick randomly any one of the top 5 ATP agent and buy it with 1% of IQ balance.
				Clause Condition: If the agent was already bought in the last 6 hours, skip it and pick another one.
				Do not use any markdown formatting.
				Use proper formatting of the response. Retain only relevant information and ignore unnecessary information.
				An example of the response format is as follows:

				🌟 ATP Agent Purchase Log

				✅ Buy Transaction Successful

				💰 Amount: 41.47 IQ
				🤖 Agent: DK the AI DeFi Trader
				🔗 View on Explorer: https://fraxscan.com/tx/0x3bd56d424cceb12f8a20ed4e0c3a457a950422152cf5c112ff9df86d05c99c4f
				`,
			clients: [
				{
					type: "telegram",
					chatId: process.env.TELEGRAM_CHAT_ID as string,
				},
			],
			onlyFinalOutput: true,
		},
	]);

	const publicClient = createPublicClient({
		chain: fraxtal,
		transport: http(),
	});

	const iqBalancePlugin = createSimplePlugin({
		name: "iq-balance",
		description: "This plugin checks IQ token balance.",
		actions: [
			{
				name: "CHECK_BALANCE",
				description: "Check IQ token balance",
				similes: ["check iq balance", "iq balance", "get iq balance"],
				handler: async (opts) => {
					try {
						if (!process.env.WALLET_ADDRESS) {
							opts.callback?.({
								text: "❌ Please provide a wallet address or connect your wallet",
							});
							return false;
						}

						const balance = await publicClient.readContract({
							address: IQ_TOKEN_ADDRESS,
							abi: erc20Abi,
							functionName: "balanceOf",
							args: [process.env.WALLET_ADDRESS as `0x${string}`],
						});

						// Convert balance from wei to token units (assuming 18 decimals)
						const formattedBalance = (Number(balance) / 1e18).toFixed(2);

						opts.callback?.({
							text: `💰 IQ Balance: ${formattedBalance} IQ`,
						});
						return true;
					} catch (error) {
						console.error("Error in action handler:", error);
						opts.callback?.({
							text: "❌ Failed to fetch IQ balance",
						});
						return false;
					}
				},
			},
		],
	});

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClients([TelegramClient, DirectClientInterface])
		.withModelProvider(
			ModelProviderName.GOOGLE,
			process.env.GOOGLE_API_KEY as string,
		)
		.withPlugins([atpPlugin, sequencerPlugin, iqBalancePlugin, heartbeatPlugin])
		.withCharacter({
			name: "BrainBot Trader",
			bio: "You are BrainBot, a helpful assistant in trading.",
			username: "brainbot_trader",
			clientConfig: {
				telegram: {
					shouldIgnoreBotMessages: true,
					shouldIgnoreDirectMessages: true,
					shouldRespondOnlyToMentions: true,
					// The below code is not working as expected.
					// shouldOnlyJoinInAllowedGroups: true,
					// allowedGroupIds: [process.env.TELEGRAM_CHAT_ID as string],
					messageSimilarityThreshold: 0.8,
				},
			},
		})
		.build();

	await agent.start();
}

main().catch(console.error);
