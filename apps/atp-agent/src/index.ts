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
import TelegramClient from "@elizaos-plugins/client-telegram";

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
			period: "0 */3 * * *", // Every 3h
			input: 
				"Use sequencer to get top ATP agent then buy with 1% of IQ balance and post log on telegram",
			clients: [
				{
					type: "telegram",
					chatId: process.env.TELEGRAM_CHAT_ID as string,
				},
			],
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
		.withClient(TelegramClient)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([atpPlugin, sequencerPlugin, iqBalancePlugin, heartbeatPlugin])
		.withCharacter({
			name: "BrainBot Trader",
			bio: "You are BrainBot, a helpful assistant in trading.",
			username: "brainbot_trader",
		})
		.build();

	await agent.start();
}

main().catch(console.error);
