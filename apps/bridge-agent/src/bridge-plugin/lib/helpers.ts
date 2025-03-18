import { elizaLogger } from "@elizaos/core";

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialBackoffMs?: number;
    logPrefix?: string;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  let backoffMs = options.initialBackoffMs ?? 1000; // Start with 1 second backoff
  let retryCount = 0;
  const logPrefix = options.logPrefix ? `[${options.logPrefix}] ` : '';
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      retryCount++;
      
      if (retryCount >= maxRetries) {
        elizaLogger.error(`${logPrefix}Operation failed after ${maxRetries} attempts`);
        throw error;
      }
      
      elizaLogger.info(`${logPrefix}Retrying operation (attempt ${retryCount}/${maxRetries}) in ${backoffMs}ms...`);
      
      // Wait with exponential backoff
      await new Promise(resolve => setTimeout(resolve, backoffMs));
      backoffMs *= 2; // Exponential backoff
    }
  }
} 