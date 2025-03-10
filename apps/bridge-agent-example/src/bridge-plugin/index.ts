import type { Plugin } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";
import { BridgeMonitorService } from "./services/bridge-monitor.ts";
import type { IQBridgeMonitorParams } from "./types.ts";
import { getBridgeStatusAction } from "./actions/bridge-status.ts";

export async function createIQBridgeMonitorPlugin(
	opts: IQBridgeMonitorParams,
): Promise<Plugin> {
	if (!opts.funderPrivateKey) {
		throw new Error("Funder private key is required for IQ Bridge Monitor");
	}

	const bridgeMonitorService = new BridgeMonitorService(opts.funderPrivateKey);

	try {
		await bridgeMonitorService.startMonitoring();
		elizaLogger.info("🚀 IQ Bridge Monitor started successfully");
	} catch (error) {
		elizaLogger.error("❌ Failed to start IQ Bridge Monitor", { error });
		throw error;
	}

	return {
		name: "IQ Bridge Monitor",
		description:
			"Monitors IQ token bridge transactions and automatically funds Fraxtal addresses with ETH",
		providers: [],
		evaluators: [],
		services: [],
		actions: [getBridgeStatusAction(bridgeMonitorService)],
	};
}

export default createIQBridgeMonitorPlugin;
