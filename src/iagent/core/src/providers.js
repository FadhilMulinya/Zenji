"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProviders = getProviders;
/**
 * Formats provider outputs into a string which can be injected into the context.
 * @param runtime The AgentRuntime object.
 * @param message The incoming message object.
 * @param state The current state object.
 * @returns A string that concatenates the outputs of each provider.
 */
async function getProviders(runtime, message, state) {
    const providerResults = (await Promise.all(runtime.providers.map(async (provider) => {
        return await provider.get(runtime, message, state);
    }))).filter((result) => result != null && result !== "");
    return providerResults.join("\n");
}
