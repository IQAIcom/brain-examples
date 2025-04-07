import SqliteAdapter from "@elizaos/adapter-sqlite";
import { ModelProviderName } from "@elizaos/core";
import { AgentBuilder } from "@iqai/agent";
import { createNearPlugin } from "@iqai/plugin-near";

async function main() {
	// Setup Near plugin.
	const nearPlugin = await createNearPlugin({
		accountId: process.env.NEAR_ACCOUNT_ID as string,
		accountKey: process.env.NEAR_PRIVATE_KEY as string,
		listeners: [
			{
				eventName: "run_agent",
				contractId: "amm-iqai.near",
				responseMethodName: "agent_response",
				handler: async (payload, { account }) => {
					const request = JSON.parse(payload.message);

					const balances = await account.viewFunction({
						contractId: "amm-iqai.near",
						methodName: "get_swap_balances",
						args: {
							token_in: request.token_in,
							token_out: request.token_out,
						},
					});

					const balance_in = BigInt(balances[0]);
					const balance_out = BigInt(balances[1]);
					const amount_in = BigInt(request.amount_in);

					const k = balance_in * balance_out;
					const new_balance_in = balance_in + amount_in;

					if (amount_in > 0 && new_balance_in > 0) {
						const new_balance_out = k / new_balance_in;
						const amount_out = balance_out - new_balance_out;
						return amount_out.toString();
					}

					throw new Error("Illegal amount");
				},
			},
		],
		networkConfig: {
			networkId: "mainnet",
			nodeUrl: "https://near.lava.build",
		},
	});

	// Build agent using builder pattern
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugin(nearPlugin)
		.build();

	await agent.start();
}

main().catch(console.error);
