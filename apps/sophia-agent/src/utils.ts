import {
	elizaLogger,
	type IAgentRuntime,
	getEmbeddingZeroVector,
	type Memory,
	stringToUuid,
	generateText,
	ModelClass,
} from "@elizaos/core";

/**
 * Processes a single wiki activity
 */
export async function processWikiActivity(
	activity: string,
	runtime: IAgentRuntime,
): Promise<void> {
	try {
		// Extract title, transaction hash and source URL
		const titleMatch = activity.match(/- Title: (.*?)(?=\r?\n|$)/m);
		const title = titleMatch?.[1]?.trim() || "Unknown Wiki";
		const isCreated = activity.includes("Created:");
		const txnMatch = activity.match(
			/Transaction: https:\/\/polygonscan\.com\/tx\/(0x[a-fA-F0-9]+)/,
		);
		const txnHash = txnMatch?.[1] || "";
		const sourceMatch = activity.match(
			/Source: (https:\/\/iq\.wiki\/.*?)(?=\r?\n|$)/m,
		);
		const sourceUrl = sourceMatch?.[1]?.trim() || "";

		// Skip if missing critical data
		if (!txnHash || !sourceUrl) {
			elizaLogger.error(`Missing transaction hash or source URL for ${title}`);
			return;
		}

		elizaLogger.info(
			`Processing wiki: ${title} (${isCreated ? "created" : "edited"})`,
		);

		// Extract relevant details for the announcement
		const summary = activity.includes("Summary:")
			? activity.match(/- Summary: (.*?)(?=\r?\n|$)/m)?.[1]?.trim() || ""
			: "";

		const changes =
			!isCreated && activity.includes("Changes:")
				? activity.match(/- Changes: (.*?)(?=\r?\n|$)/m)?.[1]?.trim() || ""
				: "";

		const sections =
			!isCreated && activity.includes("Modified sections:")
				? activity
						.match(/- Modified sections: (.*?)(?=\r?\n|$)/m)?.[1]
						?.trim() || ""
				: "";

		// Create prompt context for the announcement
		const promptContext = `
			Create a concise announcement (max 150 characters) for a wiki that was ${isCreated ? "created" : "edited"}.

			Wiki details:
			- Title: ${title}
			${summary ? `- Summary: ${summary}` : ""}
			${changes ? `- Changes: ${changes}` : ""}
			${sections ? `- Modified sections: ${sections}` : ""}

			Requirements:
			- Be creative and conversational in tone
			- For created wikis, mention this is a new wiki
			- For edited wikis, mention what was updated
			- Keep it under 150 characters
			- Do not include markdown formatting
			- Do not include the transaction link
			- End with "Read more: <link>" where the link is ${isCreated ? sourceUrl : sourceUrl.replace("/wiki/", "/revision/")}
			- IMPORTANT: The "Read more: <link>" part, including the full URL, must NOT be truncated or shortened in any way.

			Format your response as a single paragraph with no prefix or additional text.
		`;

		// Generate the announcement
		const announcement = await generateText({
			runtime,
			context: promptContext,
			modelClass: ModelClass.MEDIUM,
		});

		elizaLogger.info(`Generated announcement for ${title}: ${announcement}`);
		elizaLogger.info(`Source URL for ${title}: ${sourceUrl}`);

		// Post to ATP
		await postToAtp(runtime, announcement, txnHash);
	} catch (error) {
		throw new Error(
			`Failed to process wiki activity: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Helper function to post announcements to the ATP log
 */
async function postToAtp(
	runtime: IAgentRuntime,
	content: string,
	txnHash: string,
): Promise<void> {
	// Call ATP_ADD_AGENT_LOG action
	const addLogAction = runtime.actions.find(
		(a) => a.name === "ATP_ADD_AGENT_LOG",
	);

	if (!addLogAction) {
		elizaLogger.info("ATP_ADD_AGENT_LOG action not found");
		return;
	}

	// Create memory with IDs that match required format
	const memory: Memory = {
		userId: stringToUuid("sophia-agent"),
		agentId: runtime.agentId,
		content: {
			text: `
				Add log for the agent ${process.env.AGENT_TOKEN_CONTRACT} with the content:
				${content}
				with transaction hash: ${txnHash}
				with chainId: 137
			`,
			action: "ATP_ADD_AGENT_LOG",
		},
		roomId: stringToUuid("sophia-room"),
		embedding: getEmbeddingZeroVector(),
	};

	await runtime.messageManager.createMemory(memory);
	await addLogAction.handler(runtime, memory);
	elizaLogger.info("Successfully posted to ATP");
}
