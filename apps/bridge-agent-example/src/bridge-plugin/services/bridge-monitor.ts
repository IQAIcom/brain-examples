import {
	type Address,
	formatEther,
	type Log,
	type PublicClient,
	type WalletClient,
} from "viem";
import { WalletService } from "./wallet.ts";
import { fraxtal } from "viem/chains";
import { elizaLogger } from "@elizaos/core";
import {
	BRIDGE_ADDRESS,
	IQ_ADDRESSES,
	BRIDGE_EVENT_ABI,
	FUNDING_AMOUNT,
	MIN_IQ_THRESHOLD,
} from "../lib/constants.ts";
import type { BridgeEvent, BridgeStats } from "../types.ts";

export class BridgeMonitorService {
	private ethClient: PublicClient;
	private fraxtalClient: PublicClient;
	private walletClient: WalletClient | undefined;
	private iqAddresses = IQ_ADDRESSES;
	private fundingAmount: bigint = FUNDING_AMOUNT;
	private minIQThreshold: bigint = MIN_IQ_THRESHOLD;
	private bridgeAddress: Address = BRIDGE_ADDRESS as Address;
	private isMonitoring = false;
	private walletService: WalletService;
	private checkIntervalMs: number = 10 * 60 * 1000; // Default: check every 10 minutes
	private unwatch: (() => void) | null = null;

	private stats: BridgeStats = {
		isMonitoring: false,
		funderBalance: 0n,
	};

	constructor(
		funderPrivateKey: string,
		config?: {
			fundingAmount?: bigint;
			minIQThreshold?: bigint;
			checkIntervalMs?: number;
		},
	) {
		this.walletService = new WalletService(funderPrivateKey);

		if (config?.fundingAmount) this.fundingAmount = config.fundingAmount;
		if (config?.minIQThreshold) this.minIQThreshold = config.minIQThreshold;
		if (config?.checkIntervalMs) this.checkIntervalMs = config.checkIntervalMs;

		this.ethClient = this.walletService.getEthClient();
		this.fraxtalClient = this.walletService.getFraxtalClient();
		this.walletClient = this.walletService.getWalletClient();

		if (!this.walletClient) {
			throw new Error(
				"Failed to initialize wallet client. Please check your private key.",
			);
		}

		elizaLogger.info(`IQ Bridge Monitor initialized with:
  - Bridge address: ${this.bridgeAddress}
  - IQ token (L1): ${this.iqAddresses.ethereum}
  - IQ token (L2): ${this.iqAddresses.fraxtal}
  - Funding amount: ${formatEther(this.fundingAmount)} ETH
  - Min IQ threshold: ${formatEther(this.minIQThreshold)} IQ
  - Check interval: ${this.checkIntervalMs / 1000} seconds`);
	}

	async startMonitoring() {
		if (this.isMonitoring) {
			elizaLogger.info("Bridge monitor is already running");
			return;
		}

		if (!this.walletClient || !this.walletClient.account) {
			throw new Error(
				"Wallet client not initialized. Cannot start monitoring.",
			);
		}

		this.stats.funderBalance = await this.fraxtalClient.getBalance({
			address: this.walletClient.account.address,
		});

		elizaLogger.info(
			`Bridge monitor started. Funder balance: ${formatEther(this.stats.funderBalance)} ETH`,
		);

		try {
			this.unwatch = this.ethClient.watchContractEvent({
				address: this.bridgeAddress,
				abi: BRIDGE_EVENT_ABI,
				eventName: "ERC20BridgeInitiated",
				onLogs: (logs) => this.handleBridgeEvents(logs),
			});

			this.isMonitoring = true;
			this.stats.isMonitoring = true;
			elizaLogger.info(
				"Bridge monitoring active for ERC20BridgeInitiated events",
			);
		} catch (error) {
			elizaLogger.error(
				`Failed to set up event monitoring: ${(error as Error).message}`,
			);
			throw error;
		}
	}

	async stopMonitoring() {
		if (!this.isMonitoring) return;

		if (this.unwatch) {
			this.unwatch();
			this.unwatch = null;
		}

		this.isMonitoring = false;
		this.stats.isMonitoring = false;
		elizaLogger.info("Bridge monitoring stopped");
	}

	private async handleBridgeEvents(logs: any[]) {
		for (const log of logs) {
			try {
				const l1Token = log.args.localToken as Address;
				const from = log.args.from as Address;
				const to = log.args.to as Address;
				const amount = log.args.amount as bigint;

				if (l1Token.toLowerCase() !== this.iqAddresses.ethereum.toLowerCase()) {
					continue;
				}

				const bridgeEvent: BridgeEvent = {
					blockNumber: log.blockNumber,
					txHash: log.transactionHash,
					from: from,
					to: to,
					amount: amount,
					timestamp: log.blockTimestamp,
				};

				this.stats.lastBridgeEvent = bridgeEvent;

				elizaLogger.info(`Detected IQ bridge deposit:
  - From: ${from}
  - Token: ${l1Token}
  - Amount: ${formatEther(amount)} IQ
  - Transaction: ${log.transactionHash}`);

				if (amount >= this.minIQThreshold) {
					const recipientAddress =
						to === "0x0000000000000000000000000000000000000000" ? from : to;
					await this.processBridgeTransaction(recipientAddress, amount);
				} else {
					elizaLogger.info(
						`Skipping funding: Amount ${formatEther(amount)} IQ is below threshold of ${formatEther(this.minIQThreshold)} IQ`,
					);
				}
			} catch (error) {
				elizaLogger.error(
					`Error processing event log: ${(error as Error).message}`,
				);
			}
		}
	}

	private async processBridgeTransaction(
		userAddress: string,
		amount: bigint,
	): Promise<void> {
		try {
			elizaLogger.info(
				`Processing bridge transaction for ${userAddress} with ${formatEther(amount)} IQ`,
			);

			const frxEthBalance = await this.fraxtalClient.getBalance({
				address: userAddress as Address,
			});

			elizaLogger.info(
				`User ${userAddress} has ${formatEther(frxEthBalance)} ETH on Fraxtal`,
			);

			if (frxEthBalance < this.fundingAmount) {
				await this.fundUserAddress(userAddress, frxEthBalance);
			} else {
				elizaLogger.info(
					`User ${userAddress} already has sufficient ETH on Fraxtal. No funding needed.`,
				);
			}
		} catch (error) {
			elizaLogger.error(
				`Error processing bridge transaction: ${(error as Error).message}`,
			);
		}
	}

	private async fundUserAddress(
		userAddress: string,
		frxEthBalance: bigint,
	): Promise<void> {
		try {
			if (!this.walletClient || !this.walletClient.account) {
				throw new Error("Wallet client not initialized. Cannot fund address.");
			}

			this.stats.funderBalance = await this.fraxtalClient.getBalance({
				address: this.walletClient.account.address,
			});

			if (this.stats.funderBalance < this.fundingAmount) {
				elizaLogger.error(
					`Funding wallet balance too low: ${formatEther(this.stats.funderBalance)} ETH. Skipping funding.`,
				);
				return;
			}

			const fundingAmount = this.fundingAmount - frxEthBalance;

			const hash = await this.walletClient.sendTransaction({
				to: userAddress as Address,
				value: fundingAmount,
				chain: fraxtal,
				account: this.walletClient.account,
			});

			elizaLogger.info(`Funding transaction initiated: ${hash}`);

			const receipt = await this.fraxtalClient.waitForTransactionReceipt({
				hash,
			});

			if (receipt.status === "success") {
				this.stats.lastFundingEvent = {
					recipient: userAddress,
					amount: fundingAmount,
					txHash: hash,
					timestamp: Date.now(),
				};

				elizaLogger.info(
					`Successfully funded ${userAddress} with ${formatEther(fundingAmount)} ETH on Fraxtal (tx: ${hash})`,
				);
			} else {
				elizaLogger.error(`Funding transaction failed: ${hash}`);
			}
		} catch (error) {
			elizaLogger.error(
				`Error funding user address: ${(error as Error).message}`,
			);
		}
	}

	async getStats(): Promise<BridgeStats> {
		if (this.walletClient?.account) {
			this.stats.funderBalance = await this.fraxtalClient.getBalance({
				address: this.walletClient.account.address,
			});
		}

		return { ...this.stats };
	}
}
