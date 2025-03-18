export interface IQBridgeMonitorParams {
	funderPrivateKey: string;
	fundingAmount?: bigint;
	minIQThreshold?: bigint;
	checkIntervalMs?: number;
}

export interface BridgeEvent {
	blockNumber: number;
	txHash: string;
	from: string;
	to: string;
	amount: bigint;
	timestamp: number;
}

export interface BridgeStats {
	lastBridgeEvent?: BridgeEvent;
	lastFundingEvent?: {
		recipient: string;
		amount: bigint;
		txHash: string;
		timestamp: number;
	};
	isMonitoring: boolean;
	funderBalance: bigint;
}

export interface BridgeMonitorOptions {
	funderPrivateKey: string;
	fundingAmount?: bigint;
	minIQThreshold?: bigint;
	checkIntervalMs?: number;
}
