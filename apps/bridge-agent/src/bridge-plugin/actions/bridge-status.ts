import type { Action, Handler } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";
import type { BridgeMonitorService } from "../services/bridge-monitor.ts";
import dedent from "dedent";
import { formatEther } from "viem";
import {
	MIN_IQ_THRESHOLD,
	FUNDING_AMOUNT,
	BRIDGE_ADDRESS,
} from "../lib/constants.ts";

export const getBridgeStatusAction = (
	service: BridgeMonitorService,
): Action => {
	return {
		name: "IQ_BRIDGE_STATUS",
		description: "Check the status of the IQ ETH-FRAXTAL bridge monitor",
		similes: [
			"BRIDGE_STATUS",
			"CHECK_BRIDGE",
			"BRIDGE_MONITOR_STATUS",
			"MONITOR_STATUS",
			"BRIDGE_INFO",
		],
		validate: async () => true,
		handler: handler(service),
		examples: [
			[
				{
					user: "user",
					content: { text: "Check bridge status" },
				},
			],
			[
				{
					user: "user",
					content: { text: "What is the bridge monitoring status?" },
				},
			],
		],
	};
};

const handler =
	(service: BridgeMonitorService): Handler =>
	async (_runtime, _message, _state, _options, callback) => {
		try {
			const stats = await service.getStats();

			const statusText = stats.isMonitoring ? "Active" : "Inactive";

			let lastEventInfo = "No bridge events detected yet";
			if (stats.lastBridgeEvent) {
				const timeAgo = Math.floor(
					(Date.now() - stats.lastBridgeEvent.timestamp) / 60000,
				);
				lastEventInfo = dedent`
        Last bridge event: ${timeAgo} minutes ago
        - From: ${stats.lastBridgeEvent.from}
        - Amount: ${formatEther(stats.lastBridgeEvent.amount)} IQ
        - TX: ${stats.lastBridgeEvent.txHash}
      `;
			}

			let fundingInfo = "No users funded yet";
			if (stats.lastFundingEvent) {
				const timeAgo = Math.floor(
					(Date.now() - stats.lastFundingEvent.timestamp) / 60000,
				);
				fundingInfo = dedent`
        Last funding: ${timeAgo} minutes ago
        - Recipient: ${stats.lastFundingEvent.recipient}
        - Amount: ${formatEther(stats.lastFundingEvent.amount)} ETH
        - TX: ${stats.lastFundingEvent.txHash}
      `;
			}

			callback?.({
				text: dedent`
        *IQ Bridge Monitor Status: ${statusText}*

         Monitoring bridge at ${BRIDGE_ADDRESS}
         Auto-funding threshold: ${formatEther(MIN_IQ_THRESHOLD)}+ IQ tokens
         Funding amount: ${formatEther(FUNDING_AMOUNT)} ETH per eligible user
         Funder balance: ${formatEther(stats.funderBalance)} ETH

         *Recent Activity:*
        ${lastEventInfo}

        *Latest Funding:*
        ${fundingInfo}
      `,
			});
			return true;
		} catch (error) {
			elizaLogger.error("❌ Error getting bridge monitor status", { error });
			callback?.({
				text: dedent`
        *Bridge Status Error*

        Failed to retrieve bridge monitor status: ${(error as Error).message}
      `,
			});
			return false;
		}
	};
