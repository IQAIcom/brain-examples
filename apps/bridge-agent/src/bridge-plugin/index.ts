import type { Plugin } from "@elizaos/core";
import { BridgeMonitorService } from "./services/bridge-monitor.ts";
import type { IQBridgeMonitorParams } from "./types.ts";
import { getBridgeStatusAction } from "./actions/bridge-status.ts";
import {
	getStartMonitoringAction,
	getStopMonitoringAction,
} from "./actions/bridge-control.ts";

export async function createIQBridgeMonitorPlugin(
	opts: IQBridgeMonitorParams,
): Promise<Plugin> {
	if (!opts.funderPrivateKey) {
		throw new Error("Funder private key is required for IQ Bridge Monitor");
	}
	if (!opts.tgChatId) {
		throw new Error("Telegram chat ID is required for IQ Bridge Monitor");
	}

	const bridgeMonitorService = new BridgeMonitorService(opts);

	return {
		name: "IQ Bridge Monitor",
		description:
			"Monitors IQ token bridge transactions and automatically funds Fraxtal addresses with ETH",
		providers: [],
		evaluators: [],
		services: [],
		actions: [
			getBridgeStatusAction(bridgeMonitorService),
			getStartMonitoringAction(bridgeMonitorService),
			getStopMonitoringAction(bridgeMonitorService),
		],
	};
}

export default createIQBridgeMonitorPlugin;
