import SqliteAdapter from "@elizaos/adapter-sqlite";
import DirectClient from "@elizaos/client-direct";
import { AgentBuilder, ModelProviderName } from "@iqai/agent";
import { createAbiPlugin } from "@iqai/plugin-abi";
import { erc20Abi } from "viem";

async function main() {
	const abiPlugin = await createAbiPlugin({
		abi: erc20Abi,
		contractName: "ERC20",
		contractAddress: "0xe861F3c4F9455ffDDfD10f6A0346586347B01C7D",
		description: "ERC20 contract",
		privateKey: process.env.WALLET_PRIVATE_KEY as string,
	});

	// Create agent with plugin
	const agent = new AgentBuilder()
		.withDatabase(SqliteAdapter)
		.withClient(DirectClient)
		.withModelProvider(
			ModelProviderName.OPENAI,
			process.env.OPENAI_API_KEY as string,
		)
		.withPlugins([abiPlugin])
		.withCharacter({
			name: "ABI Bot",
			bio: "You are an ABI bot, you can query the ABI of a contract and return the result.",
			username: "abi-bot",
		})
		.build();

	await agent.start();
}

main().catch(console.error);
