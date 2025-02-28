import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import DirectClientInterface from "@elizaos/client-direct";
import Database from "better-sqlite3";
import { AgentBuilder, ModelProviderName, createSimplePlugin } from "@iqai/agent";
import * as fs from "node:fs";
import * as path from "node:path";
import { createATPPlugin } from "@iqai/plugin-atp";
import { createHeartbeatPlugin } from "@iqai/plugin-heartbeat";
import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";
import createSequencerPlugin from "@iqai/plugin-sequencer";
import { createPublicClient, http } from 'viem'
import { fraxtal } from 'viem/chains'
import { erc20Abi } from 'viem'


async function main() {
	// Initialize ATP plugin
	const atpPlugin = await createATPPlugin({
	walletPrivateKey: process.env.WALLET_PRIVATE_KEY,
	});

	const sequencerPlugin = await createSequencerPlugin();

	// Initialize Heartbeat plugin
	const heartbeatPlugin = await createHeartbeatPlugin([
	{
		// period: "0 12 * * *",  // Every day at 12:00 PM
		period: "*/5 * * * * *", // Every 5 seconds
		// period: "* * * * *", // Every minute
		input: "Post a crypto market update",
		client: "telegram",
		config: {
			chatId: process.env.TELEGRAM_CHAT_ID as string
		}
	}
	]);
	
	
	const IQ_TOKEN_ADDRESS = '0xcc3023635df54fc0e43f47bc4beb90c3d1fbda9f'

	const publicClient = createPublicClient({
	chain: fraxtal,
	transport: http()
	})

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
			// Extract address from input or use connected wallet address
			const address = "0x98c41750F292AC7730F50eA8e9f24dd0CfEd2957"
			
			if (!address) {
				opts.callback?.({
				text: "❌ Please provide a wallet address or connect your wallet"
				})
				return false
			}

			console.log("Fetching IQ balance for:", address)
			
			const balance = await publicClient.readContract({
				address: IQ_TOKEN_ADDRESS,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [address],
			})

			// Convert balance from wei to token units (assuming 18 decimals)
			const formattedBalance = (Number(balance) / 1e18).toFixed(2)

			opts.callback?.({
				text: `💰 IQ Balance: ${formattedBalance} IQ`
			})
			return true
			} catch (error) {
			console.error('Error in action handler:', error)
			opts.callback?.({
				text: "❌ Failed to fetch IQ balance"
			})
			return false
			}
		}
		}
	]
	})
	
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
		.withPlugins([atpPlugin, bootstrapPlugin, sequencerPlugin, iqBalancePlugin, heartbeatPlugin])
		.withCharacter({
			name: "BrainBot Trader",
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
