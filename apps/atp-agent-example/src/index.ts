import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import DirectClientInterface from "@elizaos/client-direct";

import Database from "better-sqlite3";
import {
	AgentBuilder,
	ModelProviderName,
	createSimplePlugin,
} from "@iqai/agent";
import * as fs from "node:fs";
import * as path from "node:path";
import { createAtpPlugin } from "@iqai/plugin-atp";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { createPublicClient, http } from "viem";
import { fraxtal } from "viem/chains";
import { erc20Abi } from "viem";

async function main() {
	// Initialize ATP plugin
	const atpPlugin = await createAtpPlugin({
		walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
	});


	const sequencerPlugin = await createSequencerPlugin();

	// Initialize Heartbeat plugin
	const heartbeatPlugin = await createHeartbeatPlugin([
		{
			// period: "0 12 * * *",  // Every day at 12:00 PM
			period: "*/2 * * * *", // Every 2 minutes
			// input: "Get the top agent from atp, calculate 1% of my iq balance and buy that agent with this iq amount.",
			input: "get my iq balance",
			client: "telegram",
			config: {
				chatId: process.env.TELEGRAM_CHAT_ID as string,
			},
		},
	]);

	// const IQ_TOKEN_ADDRESS = "0xcc3023635df54fc0e43f47bc4beb90c3d1fbda9f";
	const IQ_TOKEN_ADDRESS = "0x6EFB84bda519726Fa1c65558e520B92b51712101";
	
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
						console.log("IQ Balance:", formattedBalance);

						opts.callback?.({
							text: `💰 IQ Balance: ${formattedBalance} IQ`,
						});
						return true;
					} catch (error) {
						console.error("Error in balance action handler:", error);
						opts.callback?.({
							text: "❌ Failed to fetch IQ balance",
						});
						return false;
					}
				},
			},
		],
	});

	// Setup database
	const dataDir = path.join(process.cwd(), "./data");
	fs.mkdirSync(dataDir, { recursive: true });
	const dbPath = path.join(dataDir, "db.sqlite");
	const databaseAdapter = new SqliteDatabaseAdapter(new Database(dbPath));

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(databaseAdapter)
		.withClient("direct", DirectClientInterface)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([atpPlugin, sequencerPlugin, iqBalancePlugin, heartbeatPlugin])
		.withCharacter({
			name: "BrainBot Trader",
			bio: "You are BrainBot, a helpful assistant in trading.",
			username: "brainbot_trader",
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
