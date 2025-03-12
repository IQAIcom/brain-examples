import type { Action } from "@elizaos/core";
import { elizaLogger } from "@elizaos/core";
import { BridgeMonitorService } from "../services/bridge-monitor.ts";
import dedent from "dedent";

export const getStartMonitoringAction = (service: BridgeMonitorService): Action => {
  return {
    name: "IQ_BRIDGE_START",
    description: "Start the IQ ETH-FRAXTAL bridge monitor",
    similes: ["START_BRIDGE", "START_MONITOR", "ACTIVATE_BRIDGE"],
    validate: async () => true,
    handler: async (_runtime, _message, _state, _options, callback) => {
      try {
        await service.startMonitoring();
        
        callback?.({
          text: dedent`
            *IQ Bridge Monitor Started*
            
            The bridge monitor is now active and watching for transactions.
          `,
        });
        return true;
      } catch (error) {
        elizaLogger.error("❌ Error starting bridge monitor", { error });
        callback?.({
          text: dedent`
            *Bridge Start Error*
            
            Failed to start bridge monitor: ${(error as Error).message}
          `,
        });
        return false;
      }
    },
    examples: [
      [
        {
          user: "user",
          content: { text: "Start the bridge monitor" },
        },
      ],
    ],
  };
};

export const getStopMonitoringAction = (service: BridgeMonitorService): Action => {
  return {
    name: "IQ_BRIDGE_STOP",
    description: "Stop the IQ ETH-FRAXTAL bridge monitor",
    similes: ["STOP_BRIDGE", "STOP_MONITOR", "DEACTIVATE_BRIDGE"],
    validate: async () => true,
    handler: async (_runtime, _message, _state, _options, callback) => {
      try {
        await service.stopMonitoring();
        
        callback?.({
          text: dedent`
            *IQ Bridge Monitor Stopped*
            
            The bridge monitor has been deactivated successfully.
          `,
        });
        return true;
      } catch (error) {
        elizaLogger.error("❌ Error stopping bridge monitor", { error });
        callback?.({
          text: dedent`
            *Bridge Stop Error*
            
            Failed to stop bridge monitor: ${(error as Error).message}
          `,
        });
        return false;
      }
    },
    examples: [
      [
        {
          user: "user",
          content: { text: "Stop the bridge monitor" },
        },
      ],
    ],
  };
}; 