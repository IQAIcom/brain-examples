import { createSimplePlugin } from "@iqai/agent";
import { createPublicClient, http } from "viem";
import { fraxtal } from "viem/chains";
import { erc20Abi } from "viem";

const IQ_TOKEN_ADDRESS = "0x6EFB84bda519726Fa1c65558e520B92b51712101";

const publicClient = createPublicClient({
	chain: fraxtal,
	transport: http(),
});

export const iqBalancePlugin = createSimplePlugin({
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
