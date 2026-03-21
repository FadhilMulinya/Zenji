"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObject = exports.generateCaption = exports.generateImage = void 0;
exports.trimTokens = trimTokens;
exports.generateText = generateText;
exports.generateShouldRespond = generateShouldRespond;
exports.splitChunks = splitChunks;
exports.generateTrueOrFalse = generateTrueOrFalse;
exports.generateTextArray = generateTextArray;
exports.generateObjectDeprecated = generateObjectDeprecated;
exports.generateObjectArray = generateObjectArray;
exports.generateMessageResponse = generateMessageResponse;
exports.handleProvider = handleProvider;
exports.generateTweetActions = generateTweetActions;
const anthropic_1 = require("@ai-sdk/anthropic");
const google_1 = require("@ai-sdk/google");
const mistral_1 = require("@ai-sdk/mistral");
const groq_1 = require("@ai-sdk/groq");
const openai_1 = require("@ai-sdk/openai");
const amazon_bedrock_1 = require("@ai-sdk/amazon-bedrock");
const text_splitter_1 = require("langchain/text_splitter");
const ai_1 = require("ai");
const buffer_1 = require("buffer");
const ollama_ai_provider_1 = require("ollama-ai-provider");
const openai_2 = __importDefault(require("openai"));
const js_tiktoken_1 = require("js-tiktoken");
const transformers_1 = require("@huggingface/transformers");
const together_ai_1 = __importDefault(require("together-ai"));
const index_ts_1 = require("./index.ts");
const models_ts_1 = require("./models.ts");
const parsing_ts_1 = require("./parsing.ts");
const settings_ts_1 = __importDefault(require("./settings.ts"));
const types_ts_1 = require("./types.ts");
const client_1 = require("@fal-ai/client");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const viem_1 = require("viem");
/**
 * Trims the provided text context to a specified token limit using a tokenizer model and type.
 *
 * The function dynamically determines the truncation method based on the tokenizer settings
 * provided by the runtime. If no tokenizer settings are defined, it defaults to using the
 * TikToken truncation method with the "gpt-4o" model.
 *
 * @async
 * @function trimTokens
 * @param {string} context - The text to be tokenized and trimmed.
 * @param {number} maxTokens - The maximum number of tokens allowed after truncation.
 * @param {IAgentRuntime} runtime - The runtime interface providing tokenizer settings.
 *
 * @returns {Promise<string>} A promise that resolves to the trimmed text.
 *
 * @throws {Error} Throws an error if the runtime settings are invalid or missing required fields.
 *
 * @example
 * const trimmedText = await trimTokens("This is an example text", 50, runtime);
 * console.log(trimmedText); // Output will be a truncated version of the input text.
 */
async function trimTokens(context, maxTokens, runtime) {
    if (!context)
        return "";
    if (maxTokens <= 0)
        throw new Error("maxTokens must be positive");
    const tokenizerModel = runtime.getSetting("TOKENIZER_MODEL");
    const tokenizerType = runtime.getSetting("TOKENIZER_TYPE");
    if (!tokenizerModel || !tokenizerType) {
        // Default to TikToken truncation using the "gpt-4o" model if tokenizer settings are not defined
        return truncateTiktoken("gpt-4o", context, maxTokens);
    }
    // Choose the truncation method based on tokenizer type
    if (tokenizerType === types_ts_1.TokenizerType.Auto) {
        return truncateAuto(tokenizerModel, context, maxTokens);
    }
    if (tokenizerType === types_ts_1.TokenizerType.TikToken) {
        return truncateTiktoken(tokenizerModel, context, maxTokens);
    }
    index_ts_1.elizaLogger.warn(`Unsupported tokenizer type: ${tokenizerType}`);
    return truncateTiktoken("gpt-4o", context, maxTokens);
}
async function truncateAuto(modelPath, context, maxTokens) {
    try {
        const tokenizer = await transformers_1.AutoTokenizer.from_pretrained(modelPath);
        const tokens = tokenizer.encode(context);
        // If already within limits, return unchanged
        if (tokens.length <= maxTokens) {
            return context;
        }
        // Keep the most recent tokens by slicing from the end
        const truncatedTokens = tokens.slice(-maxTokens);
        // Decode back to text - js-tiktoken decode() returns a string directly
        return tokenizer.decode(truncatedTokens);
    }
    catch (error) {
        index_ts_1.elizaLogger.error("Error in trimTokens:", error);
        // Return truncated string if tokenization fails
        return context.slice(-maxTokens * 4); // Rough estimate of 4 chars per token
    }
}
async function truncateTiktoken(model, context, maxTokens) {
    try {
        const encoding = (0, js_tiktoken_1.encodingForModel)(model);
        // Encode the text into tokens
        const tokens = encoding.encode(context);
        // If already within limits, return unchanged
        if (tokens.length <= maxTokens) {
            return context;
        }
        // Keep the most recent tokens by slicing from the end
        const truncatedTokens = tokens.slice(-maxTokens);
        // Decode back to text - js-tiktoken decode() returns a string directly
        return encoding.decode(truncatedTokens);
    }
    catch (error) {
        index_ts_1.elizaLogger.error("Error in trimTokens:", error);
        // Return truncated string if tokenization fails
        return context.slice(-maxTokens * 4); // Rough estimate of 4 chars per token
    }
}
/**
 * Get OnChain EternalAI System Prompt
 * @returns System Prompt
 */
async function getOnChainEternalAISystemPrompt(runtime) {
    const agentId = runtime.getSetting("ETERNALAI_AGENT_ID");
    const providerUrl = runtime.getSetting("ETERNALAI_RPC_URL");
    const contractAddress = runtime.getSetting("ETERNALAI_AGENT_CONTRACT_ADDRESS");
    if (agentId && providerUrl && contractAddress) {
        // get on-chain system-prompt
        const contractABI = [
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "_agentId",
                        type: "uint256",
                    },
                ],
                name: "getAgentSystemPrompt",
                outputs: [
                    { internalType: "bytes[]", name: "", type: "bytes[]" },
                ],
                stateMutability: "view",
                type: "function",
            },
        ];
        const publicClient = (0, viem_1.createPublicClient)({
            transport: (0, viem_1.http)(providerUrl),
        });
        try {
            const validAddress = contractAddress;
            const result = await publicClient.readContract({
                address: validAddress,
                abi: contractABI,
                functionName: "getAgentSystemPrompt",
                args: [new bignumber_js_1.default(agentId)],
            });
            if (result) {
                index_ts_1.elizaLogger.info("on-chain system-prompt response", result[0]);
                const value = result[0].toString().replace("0x", "");
                const content = buffer_1.Buffer.from(value, "hex").toString("utf-8");
                index_ts_1.elizaLogger.info("on-chain system-prompt", content);
                return await fetchEternalAISystemPrompt(runtime, content);
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            index_ts_1.elizaLogger.error(error);
            index_ts_1.elizaLogger.error("err", error);
        }
    }
    return undefined;
}
/**
 * Fetch EternalAI System Prompt
 * @returns System Prompt
 */
async function fetchEternalAISystemPrompt(runtime, content) {
    const IPFS = "ipfs://";
    const containsSubstring = content.includes(IPFS);
    if (containsSubstring) {
        const lightHouse = content.replace(IPFS, "https://gateway.lighthouse.storage/ipfs/");
        index_ts_1.elizaLogger.info("fetch lightHouse", lightHouse);
        const responseLH = await fetch(lightHouse, {
            method: "GET",
        });
        index_ts_1.elizaLogger.info("fetch lightHouse resp", responseLH);
        if (responseLH.ok) {
            const data = await responseLH.text();
            return data;
        }
        else {
            const gcs = content.replace(IPFS, "https://cdn.eternalai.org/upload/");
            index_ts_1.elizaLogger.info("fetch gcs", gcs);
            const responseGCS = await fetch(gcs, {
                method: "GET",
            });
            index_ts_1.elizaLogger.info("fetch lightHouse gcs", responseGCS);
            if (responseGCS.ok) {
                const data = await responseGCS.text();
                return data;
            }
            else {
                throw new Error("invalid on-chain system prompt");
            }
        }
    }
    else {
        return content;
    }
}
/**
 * Gets the Cloudflare Gateway base URL for a specific provider if enabled
 * @param runtime The runtime environment
 * @param provider The model provider name
 * @returns The Cloudflare Gateway base URL if enabled, undefined otherwise
 */
function getCloudflareGatewayBaseURL(runtime, provider) {
    const isCloudflareEnabled = runtime.getSetting("CLOUDFLARE_GW_ENABLED") === "true";
    const cloudflareAccountId = runtime.getSetting("CLOUDFLARE_AI_ACCOUNT_ID");
    const cloudflareGatewayId = runtime.getSetting("CLOUDFLARE_AI_GATEWAY_ID");
    index_ts_1.elizaLogger.debug("Cloudflare Gateway Configuration:", {
        isEnabled: isCloudflareEnabled,
        hasAccountId: !!cloudflareAccountId,
        hasGatewayId: !!cloudflareGatewayId,
        provider: provider,
    });
    if (!isCloudflareEnabled) {
        index_ts_1.elizaLogger.debug("Cloudflare Gateway is not enabled");
        return undefined;
    }
    if (!cloudflareAccountId) {
        index_ts_1.elizaLogger.warn("Cloudflare Gateway is enabled but CLOUDFLARE_AI_ACCOUNT_ID is not set");
        return undefined;
    }
    if (!cloudflareGatewayId) {
        index_ts_1.elizaLogger.warn("Cloudflare Gateway is enabled but CLOUDFLARE_AI_GATEWAY_ID is not set");
        return undefined;
    }
    const baseURL = `https://gateway.ai.cloudflare.com/v1/${cloudflareAccountId}/${cloudflareGatewayId}/${provider.toLowerCase()}`;
    index_ts_1.elizaLogger.info("Using Cloudflare Gateway:", {
        provider,
        baseURL,
        accountId: cloudflareAccountId,
        gatewayId: cloudflareGatewayId,
    });
    return baseURL;
}
/**
 * Send a message to the model for a text generateText - receive a string back and parse how you'd like
 * @param opts - The options for the generateText request.
 * @param opts.context The context of the message to be completed.
 * @param opts.stop A list of strings to stop the generateText at.
 * @param opts.model The model to use for generateText.
 * @param opts.frequency_penalty The frequency penalty to apply to the generateText.
 * @param opts.presence_penalty The presence penalty to apply to the generateText.
 * @param opts.temperature The temperature to apply to the generateText.
 * @param opts.max_context_length The maximum length of the context to apply to the generateText.
 * @returns The completed message.
 */
async function generateText({ runtime, context, modelClass, tools = {}, onStepFinish, maxSteps = 1, stop, customSystemPrompt, verifiableInference = process.env.VERIFIABLE_INFERENCE_ENABLED === "true", verifiableInferenceOptions, }) {
    if (!context) {
        console.error("generateText context is empty");
        return "";
    }
    index_ts_1.elizaLogger.log("Generating text...");
    index_ts_1.elizaLogger.info("Generating text with options:", {
        modelProvider: runtime.modelProvider,
        model: modelClass,
        verifiableInference,
    });
    index_ts_1.elizaLogger.log("Using provider:", runtime.modelProvider);
    // If verifiable inference is requested and adapter is provided, use it
    if (verifiableInference && runtime.verifiableInferenceAdapter) {
        index_ts_1.elizaLogger.log("Using verifiable inference adapter:", runtime.verifiableInferenceAdapter);
        try {
            const result = await runtime.verifiableInferenceAdapter.generateText(context, modelClass, verifiableInferenceOptions);
            index_ts_1.elizaLogger.log("Verifiable inference result:", result);
            // Verify the proof
            const isValid = await runtime.verifiableInferenceAdapter.verifyProof(result);
            if (!isValid) {
                throw new Error("Failed to verify inference proof");
            }
            return result.text;
        }
        catch (error) {
            index_ts_1.elizaLogger.error("Error in verifiable inference:", error);
            throw error;
        }
    }
    const provider = runtime.modelProvider;
    index_ts_1.elizaLogger.debug("Provider settings:", {
        provider,
        hasRuntime: !!runtime,
        runtimeSettings: {
            CLOUDFLARE_GW_ENABLED: runtime.getSetting("CLOUDFLARE_GW_ENABLED"),
            CLOUDFLARE_AI_ACCOUNT_ID: runtime.getSetting("CLOUDFLARE_AI_ACCOUNT_ID"),
            CLOUDFLARE_AI_GATEWAY_ID: runtime.getSetting("CLOUDFLARE_AI_GATEWAY_ID"),
        },
    });
    const endpoint = runtime.character.modelEndpointOverride || (0, models_ts_1.getEndpoint)(provider);
    const modelSettings = (0, models_ts_1.getModelSettings)(runtime.modelProvider, modelClass);
    let model = modelSettings.name;
    // allow character.json settings => secrets to override models
    // FIXME: add MODEL_MEDIUM support
    switch (provider) {
        // if runtime.getSetting("LLAMACLOUD_MODEL_LARGE") is true and modelProvider is LLAMACLOUD, then use the large model
        case types_ts_1.ModelProviderName.LLAMACLOUD:
            {
                switch (modelClass) {
                    case types_ts_1.ModelClass.LARGE:
                        {
                            model =
                                runtime.getSetting("LLAMACLOUD_MODEL_LARGE") ||
                                    model;
                        }
                        break;
                    case types_ts_1.ModelClass.SMALL:
                        {
                            model =
                                runtime.getSetting("LLAMACLOUD_MODEL_SMALL") ||
                                    model;
                        }
                        break;
                }
            }
            break;
        case types_ts_1.ModelProviderName.TOGETHER:
            {
                switch (modelClass) {
                    case types_ts_1.ModelClass.LARGE:
                        {
                            model =
                                runtime.getSetting("TOGETHER_MODEL_LARGE") ||
                                    model;
                        }
                        break;
                    case types_ts_1.ModelClass.SMALL:
                        {
                            model =
                                runtime.getSetting("TOGETHER_MODEL_SMALL") ||
                                    model;
                        }
                        break;
                }
            }
            break;
        case types_ts_1.ModelProviderName.OPENROUTER:
            {
                switch (modelClass) {
                    case types_ts_1.ModelClass.LARGE:
                        {
                            model =
                                runtime.getSetting("LARGE_OPENROUTER_MODEL") ||
                                    model;
                        }
                        break;
                    case types_ts_1.ModelClass.SMALL:
                        {
                            model =
                                runtime.getSetting("SMALL_OPENROUTER_MODEL") ||
                                    model;
                        }
                        break;
                }
            }
            break;
    }
    index_ts_1.elizaLogger.info("Selected model:", model);
    const modelConfiguration = runtime.character?.settings?.modelConfig;
    const temperature = modelConfiguration?.temperature || modelSettings.temperature;
    const frequency_penalty = modelConfiguration?.frequency_penalty ||
        modelSettings.frequency_penalty;
    const presence_penalty = modelConfiguration?.presence_penalty || modelSettings.presence_penalty;
    const max_context_length = modelConfiguration?.maxInputTokens || modelSettings.maxInputTokens;
    const max_response_length = modelConfiguration?.maxOutputTokens ||
        modelSettings.maxOutputTokens;
    const experimental_telemetry = modelConfiguration?.experimental_telemetry ||
        modelSettings.experimental_telemetry;
    const apiKey = runtime.token;
    try {
        index_ts_1.elizaLogger.debug(`Trimming context to max length of ${max_context_length} tokens.`);
        context = await trimTokens(context, max_context_length, runtime);
        let response;
        const _stop = stop || modelSettings.stop;
        index_ts_1.elizaLogger.debug(`Using provider: ${provider}, model: ${model}, temperature: ${temperature}, max response length: ${max_response_length}`);
        switch (provider) {
            // OPENAI & LLAMACLOUD shared same structure.
            case types_ts_1.ModelProviderName.OPENAI:
            case types_ts_1.ModelProviderName.ALI_BAILIAN:
            case types_ts_1.ModelProviderName.VOLENGINE:
            case types_ts_1.ModelProviderName.LLAMACLOUD:
            case types_ts_1.ModelProviderName.NANOGPT:
            case types_ts_1.ModelProviderName.HYPERBOLIC:
            case types_ts_1.ModelProviderName.TOGETHER:
            case types_ts_1.ModelProviderName.NINETEEN_AI:
            case types_ts_1.ModelProviderName.AKASH_CHAT_API:
            case types_ts_1.ModelProviderName.LMSTUDIO: {
                index_ts_1.elizaLogger.debug("Initializing OpenAI model with Cloudflare check");
                const baseURL = getCloudflareGatewayBaseURL(runtime, "openai") || endpoint;
                //elizaLogger.debug("OpenAI baseURL result:", { baseURL });
                const openai = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL,
                    fetch: runtime.fetch,
                });
                const { text: openaiResponse } = await (0, ai_1.generateText)({
                    model: openai.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = openaiResponse;
                console.log("Received response from OpenAI model.");
                break;
            }
            case types_ts_1.ModelProviderName.ETERNALAI: {
                index_ts_1.elizaLogger.debug("Initializing EternalAI model.");
                const openai = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL: endpoint,
                    fetch: async (input, init) => {
                        const url = typeof input === "string"
                            ? input
                            : input.toString();
                        const chain_id = runtime.getSetting("ETERNALAI_CHAIN_ID") || "45762";
                        const options = { ...init };
                        if (options?.body) {
                            const body = JSON.parse(options.body);
                            body.chain_id = chain_id;
                            options.body = JSON.stringify(body);
                        }
                        const fetching = await runtime.fetch(url, options);
                        if ((0, parsing_ts_1.parseBooleanFromText)(runtime.getSetting("ETERNALAI_LOG"))) {
                            index_ts_1.elizaLogger.info("Request data: ", JSON.stringify(options, null, 2));
                            const clonedResponse = fetching.clone();
                            try {
                                clonedResponse.json().then((data) => {
                                    index_ts_1.elizaLogger.info("Response data: ", JSON.stringify(data, null, 2));
                                });
                            }
                            catch (e) {
                                index_ts_1.elizaLogger.debug(e);
                            }
                        }
                        return fetching;
                    },
                });
                let system_prompt = runtime.character.system ??
                    settings_ts_1.default.SYSTEM_PROMPT ??
                    undefined;
                try {
                    const on_chain_system_prompt = await getOnChainEternalAISystemPrompt(runtime);
                    if (!on_chain_system_prompt) {
                        index_ts_1.elizaLogger.error(new Error("invalid on_chain_system_prompt"));
                    }
                    else {
                        system_prompt = on_chain_system_prompt;
                        index_ts_1.elizaLogger.info("new on-chain system prompt", system_prompt);
                    }
                }
                catch (e) {
                    index_ts_1.elizaLogger.error(e);
                }
                const { text: openaiResponse } = await (0, ai_1.generateText)({
                    model: openai.languageModel(model),
                    prompt: context,
                    system: system_prompt,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                });
                response = openaiResponse;
                index_ts_1.elizaLogger.debug("Received response from EternalAI model.");
                break;
            }
            case types_ts_1.ModelProviderName.GOOGLE: {
                const google = (0, google_1.createGoogleGenerativeAI)({
                    apiKey,
                    fetch: runtime.fetch,
                });
                const { text: googleResponse } = await (0, ai_1.generateText)({
                    model: google(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = googleResponse;
                index_ts_1.elizaLogger.debug("Received response from Google model.");
                break;
            }
            case types_ts_1.ModelProviderName.MISTRAL: {
                const mistral = (0, mistral_1.createMistral)();
                const { text: mistralResponse } = await (0, ai_1.generateText)({
                    model: mistral(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                });
                response = mistralResponse;
                index_ts_1.elizaLogger.debug("Received response from Mistral model.");
                break;
            }
            case types_ts_1.ModelProviderName.ANTHROPIC: {
                index_ts_1.elizaLogger.debug("Initializing Anthropic model with Cloudflare check");
                const baseURL = getCloudflareGatewayBaseURL(runtime, "anthropic") ||
                    "https://api.anthropic.com/v1";
                index_ts_1.elizaLogger.debug("Anthropic baseURL result:", { baseURL });
                const anthropic = (0, anthropic_1.createAnthropic)({
                    apiKey,
                    baseURL,
                    fetch: runtime.fetch,
                });
                const { text: anthropicResponse } = await (0, ai_1.generateText)({
                    model: anthropic.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = anthropicResponse;
                index_ts_1.elizaLogger.debug("Received response from Anthropic model.");
                break;
            }
            case types_ts_1.ModelProviderName.CLAUDE_VERTEX: {
                index_ts_1.elizaLogger.debug("Initializing Claude Vertex model.");
                const anthropic = (0, anthropic_1.createAnthropic)({
                    apiKey,
                    fetch: runtime.fetch,
                });
                const { text: anthropicResponse } = await (0, ai_1.generateText)({
                    model: anthropic.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = anthropicResponse;
                index_ts_1.elizaLogger.debug("Received response from Claude Vertex model.");
                break;
            }
            case types_ts_1.ModelProviderName.GROK: {
                index_ts_1.elizaLogger.debug("Initializing Grok model.");
                const grok = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL: endpoint,
                    fetch: runtime.fetch,
                });
                const { text: grokResponse } = await (0, ai_1.generateText)({
                    model: grok.languageModel(model, {
                        parallelToolCalls: false,
                    }),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = grokResponse;
                index_ts_1.elizaLogger.debug("Received response from Grok model.");
                break;
            }
            case types_ts_1.ModelProviderName.GROQ: {
                index_ts_1.elizaLogger.debug("Initializing Groq model with Cloudflare check");
                const baseURL = getCloudflareGatewayBaseURL(runtime, "groq");
                index_ts_1.elizaLogger.debug("Groq baseURL result:", { baseURL });
                const groq = (0, groq_1.createGroq)({
                    apiKey,
                    fetch: runtime.fetch,
                    baseURL,
                });
                const { text: groqResponse } = await (0, ai_1.generateText)({
                    model: groq.languageModel(model),
                    prompt: context,
                    temperature,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools,
                    onStepFinish: onStepFinish,
                    maxSteps,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry,
                });
                response = groqResponse;
                index_ts_1.elizaLogger.debug("Received response from Groq model.");
                break;
            }
            case types_ts_1.ModelProviderName.LLAMALOCAL: {
                index_ts_1.elizaLogger.debug("Using local Llama model for text completion.");
                const textGenerationService = runtime.getService(types_ts_1.ServiceType.TEXT_GENERATION);
                if (!textGenerationService) {
                    throw new Error("Text generation service not found");
                }
                response = await textGenerationService.queueTextCompletion(context, temperature, _stop, frequency_penalty, presence_penalty, max_response_length);
                index_ts_1.elizaLogger.debug("Received response from local Llama model.");
                break;
            }
            case types_ts_1.ModelProviderName.REDPILL: {
                index_ts_1.elizaLogger.debug("Initializing RedPill model.");
                const serverUrl = (0, models_ts_1.getEndpoint)(provider);
                const openai = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL: serverUrl,
                    fetch: runtime.fetch,
                });
                const { text: redpillResponse } = await (0, ai_1.generateText)({
                    model: openai.languageModel(model),
                    prompt: context,
                    temperature: temperature,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = redpillResponse;
                index_ts_1.elizaLogger.debug("Received response from redpill model.");
                break;
            }
            case types_ts_1.ModelProviderName.OPENROUTER: {
                index_ts_1.elizaLogger.debug("Initializing OpenRouter model.");
                const serverUrl = (0, models_ts_1.getEndpoint)(provider);
                const openrouter = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL: serverUrl,
                    fetch: runtime.fetch,
                });
                const { text: openrouterResponse } = await (0, ai_1.generateText)({
                    model: openrouter.languageModel(model),
                    prompt: context,
                    temperature: temperature,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = openrouterResponse;
                index_ts_1.elizaLogger.debug("Received response from OpenRouter model.");
                break;
            }
            case types_ts_1.ModelProviderName.OLLAMA:
                {
                    index_ts_1.elizaLogger.debug("Initializing Ollama model.");
                    const ollamaProvider = (0, ollama_ai_provider_1.createOllama)({
                        baseURL: (0, models_ts_1.getEndpoint)(provider) + "/api",
                        fetch: runtime.fetch,
                    });
                    const ollama = ollamaProvider(model);
                    index_ts_1.elizaLogger.debug("****** MODEL\n", model);
                    const { text: ollamaResponse } = await (0, ai_1.generateText)({
                        model: ollama,
                        prompt: context,
                        tools: tools,
                        onStepFinish: onStepFinish,
                        temperature: temperature,
                        maxSteps: maxSteps,
                        maxTokens: max_response_length,
                        frequencyPenalty: frequency_penalty,
                        presencePenalty: presence_penalty,
                        experimental_telemetry: experimental_telemetry,
                    });
                    response = ollamaResponse;
                }
                index_ts_1.elizaLogger.debug("Received response from Ollama model.");
                break;
            case types_ts_1.ModelProviderName.HEURIST: {
                index_ts_1.elizaLogger.debug("Initializing Heurist model.");
                const heurist = (0, openai_1.createOpenAI)({
                    apiKey: apiKey,
                    baseURL: endpoint,
                    fetch: runtime.fetch,
                });
                const { text: heuristResponse } = await (0, ai_1.generateText)({
                    model: heurist.languageModel(model),
                    prompt: context,
                    system: customSystemPrompt ??
                        runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    maxSteps: maxSteps,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = heuristResponse;
                index_ts_1.elizaLogger.debug("Received response from Heurist model.");
                break;
            }
            case types_ts_1.ModelProviderName.GAIANET: {
                index_ts_1.elizaLogger.debug("Initializing GAIANET model.");
                var baseURL = (0, models_ts_1.getEndpoint)(provider);
                if (!baseURL) {
                    switch (modelClass) {
                        case types_ts_1.ModelClass.SMALL:
                            baseURL =
                                settings_ts_1.default.SMALL_GAIANET_SERVER_URL ||
                                    "https://llama3b.gaia.domains/v1";
                            break;
                        case types_ts_1.ModelClass.MEDIUM:
                            baseURL =
                                settings_ts_1.default.MEDIUM_GAIANET_SERVER_URL ||
                                    "https://llama8b.gaia.domains/v1";
                            break;
                        case types_ts_1.ModelClass.LARGE:
                            baseURL =
                                settings_ts_1.default.LARGE_GAIANET_SERVER_URL ||
                                    "https://qwen72b.gaia.domains/v1";
                            break;
                    }
                }
                index_ts_1.elizaLogger.debug("Using GAIANET model with baseURL:", baseURL);
                const openai = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL: endpoint,
                    fetch: runtime.fetch,
                });
                const { text: openaiResponse } = await (0, ai_1.generateText)({
                    model: openai.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = openaiResponse;
                index_ts_1.elizaLogger.debug("Received response from GAIANET model.");
                break;
            }
            case types_ts_1.ModelProviderName.ATOMA: {
                index_ts_1.elizaLogger.debug("Initializing Atoma model.");
                const atoma = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL: endpoint,
                    fetch: runtime.fetch,
                });
                const { text: atomaResponse } = await (0, ai_1.generateText)({
                    model: atoma.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = atomaResponse;
                index_ts_1.elizaLogger.debug("Received response from Atoma model.");
                break;
            }
            case types_ts_1.ModelProviderName.GALADRIEL: {
                index_ts_1.elizaLogger.debug("Initializing Galadriel model.");
                const headers = {};
                const fineTuneApiKey = runtime.getSetting("GALADRIEL_FINE_TUNE_API_KEY");
                if (fineTuneApiKey) {
                    headers["Fine-Tune-Authentication"] = fineTuneApiKey;
                }
                const galadriel = (0, openai_1.createOpenAI)({
                    headers,
                    apiKey: apiKey,
                    baseURL: endpoint,
                    fetch: runtime.fetch,
                });
                const { text: galadrielResponse } = await (0, ai_1.generateText)({
                    model: galadriel.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = galadrielResponse;
                index_ts_1.elizaLogger.debug("Received response from Galadriel model.");
                break;
            }
            case types_ts_1.ModelProviderName.INFERA: {
                index_ts_1.elizaLogger.debug("Initializing Infera model.");
                const apiKey = settings_ts_1.default.INFERA_API_KEY || runtime.token;
                const infera = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL: endpoint,
                    headers: {
                        api_key: apiKey,
                        "Content-Type": "application/json",
                    },
                });
                const { text: inferaResponse } = await (0, ai_1.generateText)({
                    model: infera.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    temperature: temperature,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                });
                response = inferaResponse;
                index_ts_1.elizaLogger.debug("Received response from Infera model.");
                break;
            }
            case types_ts_1.ModelProviderName.VENICE: {
                index_ts_1.elizaLogger.debug("Initializing Venice model.");
                const venice = (0, openai_1.createOpenAI)({
                    apiKey: apiKey,
                    baseURL: endpoint,
                });
                const { text: veniceResponse } = await (0, ai_1.generateText)({
                    model: venice.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    temperature: temperature,
                    maxSteps: maxSteps,
                    maxTokens: max_response_length,
                });
                // console.warn("veniceResponse:")
                // console.warn(veniceResponse)
                //rferrari: remove all text from <think> to </think>\n\n
                response = veniceResponse
                    .replace(/<think>[\s\S]*?<\/think>\s*\n*/g, '');
                // console.warn(response)
                // response = veniceResponse;
                index_ts_1.elizaLogger.debug("Received response from Venice model.");
                break;
            }
            case types_ts_1.ModelProviderName.NVIDIA: {
                index_ts_1.elizaLogger.debug("Initializing NVIDIA model.");
                const nvidia = (0, openai_1.createOpenAI)({
                    apiKey: apiKey,
                    baseURL: endpoint,
                });
                const { text: nvidiaResponse } = await (0, ai_1.generateText)({
                    model: nvidia.languageModel(model),
                    prompt: context,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    temperature: temperature,
                    maxSteps: maxSteps,
                    maxTokens: max_response_length,
                });
                response = nvidiaResponse;
                index_ts_1.elizaLogger.debug("Received response from NVIDIA model.");
                break;
            }
            case types_ts_1.ModelProviderName.DEEPSEEK: {
                index_ts_1.elizaLogger.debug("Initializing Deepseek model.");
                const serverUrl = models_ts_1.models[provider].endpoint;
                const deepseek = (0, openai_1.createOpenAI)({
                    apiKey,
                    baseURL: serverUrl,
                    fetch: runtime.fetch,
                });
                const { text: deepseekResponse } = await (0, ai_1.generateText)({
                    model: deepseek.languageModel(model),
                    prompt: context,
                    temperature: temperature,
                    system: runtime.character.system ??
                        settings_ts_1.default.SYSTEM_PROMPT ??
                        undefined,
                    tools: tools,
                    onStepFinish: onStepFinish,
                    maxSteps: maxSteps,
                    maxTokens: max_response_length,
                    frequencyPenalty: frequency_penalty,
                    presencePenalty: presence_penalty,
                    experimental_telemetry: experimental_telemetry,
                });
                response = deepseekResponse;
                index_ts_1.elizaLogger.debug("Received response from Deepseek model.");
                break;
            }
            case types_ts_1.ModelProviderName.LIVEPEER: {
                index_ts_1.elizaLogger.debug("Initializing Livepeer model.");
                if (!endpoint) {
                    throw new Error("Livepeer Gateway URL is not defined");
                }
                const requestBody = {
                    model: model,
                    messages: [
                        {
                            role: "system",
                            content: runtime.character.system ??
                                settings_ts_1.default.SYSTEM_PROMPT ??
                                "You are a helpful assistant",
                        },
                        {
                            role: "user",
                            content: context,
                        },
                    ],
                    max_tokens: max_response_length,
                    stream: false,
                };
                const fetchResponse = await runtime.fetch(endpoint + "/llm", {
                    method: "POST",
                    headers: {
                        accept: "text/event-stream",
                        "Content-Type": "application/json",
                        Authorization: "Bearer eliza-app-llm",
                    },
                    body: JSON.stringify(requestBody),
                });
                if (!fetchResponse.ok) {
                    const errorText = await fetchResponse.text();
                    throw new Error(`Livepeer request failed (${fetchResponse.status}): ${errorText}`);
                }
                const json = await fetchResponse.json();
                if (!json?.choices?.[0]?.message?.content) {
                    throw new Error("Invalid response format from Livepeer");
                }
                response = json.choices[0].message.content.replace(/<\|start_header_id\|>assistant<\|end_header_id\|>\n\n/, "");
                index_ts_1.elizaLogger.debug("Successfully received response from Livepeer model");
                break;
            }
            default: {
                const errorMessage = `Unsupported provider: ${provider}`;
                index_ts_1.elizaLogger.error(errorMessage);
                throw new Error(errorMessage);
            }
        }
        return response;
    }
    catch (error) {
        index_ts_1.elizaLogger.error("Error in generateText:", error);
        throw error;
    }
}
/**
 * Sends a message to the model to determine if it should respond to the given context.
 * @param opts - The options for the generateText request
 * @param opts.context The context to evaluate for response
 * @param opts.stop A list of strings to stop the generateText at
 * @param opts.model The model to use for generateText
 * @param opts.frequency_penalty The frequency penalty to apply (0.0 to 2.0)
 * @param opts.presence_penalty The presence penalty to apply (0.0 to 2.0)
 * @param opts.temperature The temperature to control randomness (0.0 to 2.0)
 * @param opts.serverUrl The URL of the API server
 * @param opts.max_context_length Maximum allowed context length in tokens
 * @param opts.max_response_length Maximum allowed response length in tokens
 * @returns Promise resolving to "RESPOND", "IGNORE", "STOP" or null
 */
async function generateShouldRespond({ runtime, context, modelClass, }) {
    let retryDelay = 1000;
    while (true) {
        try {
            index_ts_1.elizaLogger.debug("Attempting to generate text with context:", context);
            const response = await generateText({
                runtime,
                context,
                modelClass,
            });
            index_ts_1.elizaLogger.debug("Received response from generateText:", response);
            const parsedResponse = (0, parsing_ts_1.parseShouldRespondFromText)(response.trim());
            if (parsedResponse) {
                index_ts_1.elizaLogger.debug("Parsed response:", parsedResponse);
                return parsedResponse;
            }
            else {
                index_ts_1.elizaLogger.debug("generateShouldRespond no response");
            }
        }
        catch (error) {
            index_ts_1.elizaLogger.error("Error in generateShouldRespond:", error);
            if (error instanceof TypeError &&
                error.message.includes("queueTextCompletion")) {
                index_ts_1.elizaLogger.error("TypeError: Cannot read properties of null (reading 'queueTextCompletion')");
            }
        }
        index_ts_1.elizaLogger.log(`Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2;
    }
}
/**
 * Splits content into chunks of specified size with optional overlapping bleed sections
 * @param content - The text content to split into chunks
 * @param chunkSize - The maximum size of each chunk in tokens
 * @param bleed - Number of characters to overlap between chunks (default: 100)
 * @returns Promise resolving to array of text chunks with bleed sections
 */
async function splitChunks(content, chunkSize = 512, bleed = 20) {
    index_ts_1.elizaLogger.debug(`[splitChunks] Starting text split`);
    const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize: Number(chunkSize),
        chunkOverlap: Number(bleed),
    });
    const chunks = await textSplitter.splitText(content);
    index_ts_1.elizaLogger.debug(`[splitChunks] Split complete:`, {
        numberOfChunks: chunks.length,
        averageChunkSize: chunks.reduce((acc, chunk) => acc + chunk.length, 0) /
            chunks.length,
    });
    return chunks;
}
/**
 * Sends a message to the model and parses the response as a boolean value
 * @param opts - The options for the generateText request
 * @param opts.context The context to evaluate for the boolean response
 * @param opts.stop A list of strings to stop the generateText at
 * @param opts.model The model to use for generateText
 * @param opts.frequency_penalty The frequency penalty to apply (0.0 to 2.0)
 * @param opts.presence_penalty The presence penalty to apply (0.0 to 2.0)
 * @param opts.temperature The temperature to control randomness (0.0 to 2.0)
 * @param opts.serverUrl The URL of the API server
 * @param opts.max_context_length Maximum allowed context length in tokens
 * @param opts.max_response_length Maximum allowed response length in tokens
 * @returns Promise resolving to a boolean value parsed from the model's response
 */
async function generateTrueOrFalse({ runtime, context = "", modelClass, }) {
    let retryDelay = 1000;
    const modelSettings = (0, models_ts_1.getModelSettings)(runtime.modelProvider, modelClass);
    const stop = Array.from(new Set([...(modelSettings.stop || []), ["\n"]]));
    while (true) {
        try {
            const response = await generateText({
                stop,
                runtime,
                context,
                modelClass,
            });
            const parsedResponse = (0, parsing_ts_1.parseBooleanFromText)(response.trim());
            if (parsedResponse !== null) {
                return parsedResponse;
            }
        }
        catch (error) {
            index_ts_1.elizaLogger.error("Error in generateTrueOrFalse:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2;
    }
}
/**
 * Send a message to the model and parse the response as a string array
 * @param opts - The options for the generateText request
 * @param opts.context The context/prompt to send to the model
 * @param opts.stop Array of strings that will stop the model's generation if encountered
 * @param opts.model The language model to use
 * @param opts.frequency_penalty The frequency penalty to apply (0.0 to 2.0)
 * @param opts.presence_penalty The presence penalty to apply (0.0 to 2.0)
 * @param opts.temperature The temperature to control randomness (0.0 to 2.0)
 * @param opts.serverUrl The URL of the API server
 * @param opts.token The API token for authentication
 * @param opts.max_context_length Maximum allowed context length in tokens
 * @param opts.max_response_length Maximum allowed response length in tokens
 * @returns Promise resolving to an array of strings parsed from the model's response
 */
async function generateTextArray({ runtime, context, modelClass, }) {
    if (!context) {
        index_ts_1.elizaLogger.error("generateTextArray context is empty");
        return [];
    }
    let retryDelay = 1000;
    while (true) {
        try {
            const response = await generateText({
                runtime,
                context,
                modelClass,
            });
            const parsedResponse = (0, parsing_ts_1.parseJsonArrayFromText)(response);
            if (parsedResponse) {
                return parsedResponse;
            }
        }
        catch (error) {
            index_ts_1.elizaLogger.error("Error in generateTextArray:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2;
    }
}
async function generateObjectDeprecated({ runtime, context, modelClass, }) {
    if (!context) {
        index_ts_1.elizaLogger.error("generateObjectDeprecated context is empty");
        return null;
    }
    let retryDelay = 1000;
    while (true) {
        try {
            // this is slightly different than generateObjectArray, in that we parse object, not object array
            const response = await generateText({
                runtime,
                context,
                modelClass,
            });
            const parsedResponse = (0, parsing_ts_1.parseJSONObjectFromText)(response);
            if (parsedResponse) {
                return parsedResponse;
            }
        }
        catch (error) {
            index_ts_1.elizaLogger.error("Error in generateObject:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2;
    }
}
async function generateObjectArray({ runtime, context, modelClass, }) {
    if (!context) {
        index_ts_1.elizaLogger.error("generateObjectArray context is empty");
        return [];
    }
    let retryDelay = 1000;
    while (true) {
        try {
            const response = await generateText({
                runtime,
                context,
                modelClass,
            });
            const parsedResponse = (0, parsing_ts_1.parseJsonArrayFromText)(response);
            if (parsedResponse) {
                return parsedResponse;
            }
        }
        catch (error) {
            index_ts_1.elizaLogger.error("Error in generateTextArray:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2;
    }
}
/**
 * Send a message to the model for generateText.
 * @param opts - The options for the generateText request.
 * @param opts.context The context of the message to be completed.
 * @param opts.stop A list of strings to stop the generateText at.
 * @param opts.model The model to use for generateText.
 * @param opts.frequency_penalty The frequency penalty to apply to the generateText.
 * @param opts.presence_penalty The presence penalty to apply to the generateText.
 * @param opts.temperature The temperature to apply to the generateText.
 * @param opts.max_context_length The maximum length of the context to apply to the generateText.
 * @returns The completed message.
 */
async function generateMessageResponse({ runtime, context, modelClass, }) {
    const modelSettings = (0, models_ts_1.getModelSettings)(runtime.modelProvider, modelClass);
    const max_context_length = modelSettings.maxInputTokens;
    context = await trimTokens(context, max_context_length, runtime);
    index_ts_1.elizaLogger.debug("Context:", context);
    let retryLength = 1000; // exponential backoff
    while (true) {
        try {
            index_ts_1.elizaLogger.log("Generating message response..");
            const response = await generateText({
                runtime,
                context,
                modelClass,
            });
            // try parsing the response as JSON, if null then try again
            const parsedContent = (0, parsing_ts_1.parseJSONObjectFromText)(response);
            if (!parsedContent) {
                index_ts_1.elizaLogger.debug("parsedContent is null, retrying");
                continue;
            }
            return parsedContent;
        }
        catch (error) {
            index_ts_1.elizaLogger.error("ERROR:", error);
            // wait for 2 seconds
            retryLength *= 2;
            await new Promise((resolve) => setTimeout(resolve, retryLength));
            index_ts_1.elizaLogger.debug("Retrying...");
        }
    }
}
const generateImage = async (data, runtime) => {
    const modelSettings = (0, models_ts_1.getImageModelSettings)(runtime.imageModelProvider);
    if (!modelSettings) {
        index_ts_1.elizaLogger.warn("No model settings found for the image model provider.");
        return { success: false, error: "No model settings available" };
    }
    const model = modelSettings.name;
    index_ts_1.elizaLogger.info("Generating image with options:", {
        imageModelProvider: model,
    });
    const apiKey = runtime.imageModelProvider === runtime.modelProvider
        ? runtime.token
        : (() => {
            // First try to match the specific provider
            switch (runtime.imageModelProvider) {
                case types_ts_1.ModelProviderName.HEURIST:
                    return runtime.getSetting("HEURIST_API_KEY");
                case types_ts_1.ModelProviderName.TOGETHER:
                    return runtime.getSetting("TOGETHER_API_KEY");
                case types_ts_1.ModelProviderName.FAL:
                    return runtime.getSetting("FAL_API_KEY");
                case types_ts_1.ModelProviderName.OPENAI:
                    return runtime.getSetting("OPENAI_API_KEY");
                case types_ts_1.ModelProviderName.VENICE:
                    return runtime.getSetting("VENICE_API_KEY");
                case types_ts_1.ModelProviderName.LIVEPEER:
                    return runtime.getSetting("LIVEPEER_GATEWAY_URL");
                default:
                    // If no specific match, try the fallback chain
                    return (runtime.getSetting("HEURIST_API_KEY") ??
                        runtime.getSetting("NINETEEN_AI_API_KEY") ??
                        runtime.getSetting("TOGETHER_API_KEY") ??
                        runtime.getSetting("FAL_API_KEY") ??
                        runtime.getSetting("OPENAI_API_KEY") ??
                        runtime.getSetting("VENICE_API_KEY") ??
                        runtime.getSetting("LIVEPEER_GATEWAY_URL"));
            }
        })();
    try {
        if (runtime.imageModelProvider === types_ts_1.ModelProviderName.HEURIST) {
            const response = await fetch("http://sequencer.heurist.xyz/submit_job", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    job_id: data.jobId || crypto.randomUUID(),
                    model_input: {
                        SD: {
                            prompt: data.prompt,
                            neg_prompt: data.negativePrompt,
                            num_iterations: data.numIterations || 20,
                            width: data.width || 512,
                            height: data.height || 512,
                            guidance_scale: data.guidanceScale || 3,
                            seed: data.seed || -1,
                        },
                    },
                    model_id: model,
                    deadline: 60,
                    priority: 1,
                }),
            });
            if (!response.ok) {
                throw new Error(`Heurist image generation failed: ${response.statusText}`);
            }
            const imageURL = await response.json();
            return { success: true, data: [imageURL] };
        }
        else if (runtime.imageModelProvider === types_ts_1.ModelProviderName.TOGETHER ||
            // for backwards compat
            runtime.imageModelProvider === types_ts_1.ModelProviderName.LLAMACLOUD) {
            const together = new together_ai_1.default({ apiKey: apiKey });
            const response = await together.images.create({
                model: model,
                prompt: data.prompt,
                width: data.width,
                height: data.height,
                steps: modelSettings?.steps ?? 4,
                n: data.count,
            });
            // Add type assertion to handle the response properly
            const togetherResponse = response;
            if (!togetherResponse.data ||
                !Array.isArray(togetherResponse.data)) {
                throw new Error("Invalid response format from Together AI");
            }
            // Rest of the code remains the same...
            const base64s = await Promise.all(togetherResponse.data.map(async (image) => {
                if (!image.url) {
                    index_ts_1.elizaLogger.error("Missing URL in image data:", image);
                    throw new Error("Missing URL in Together AI response");
                }
                // Fetch the image from the URL
                const imageResponse = await fetch(image.url);
                if (!imageResponse.ok) {
                    throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
                }
                // Convert to blob and then to base64
                const blob = await imageResponse.blob();
                const arrayBuffer = await blob.arrayBuffer();
                const base64 = buffer_1.Buffer.from(arrayBuffer).toString("base64");
                // Return with proper MIME type
                return `data:image/jpeg;base64,${base64}`;
            }));
            if (base64s.length === 0) {
                throw new Error("No images generated by Together AI");
            }
            index_ts_1.elizaLogger.debug(`Generated ${base64s.length} images`);
            return { success: true, data: base64s };
        }
        else if (runtime.imageModelProvider === types_ts_1.ModelProviderName.FAL) {
            client_1.fal.config({
                credentials: apiKey,
            });
            // Prepare the input parameters according to their schema
            const input = {
                prompt: data.prompt,
                image_size: "square",
                num_inference_steps: modelSettings?.steps ?? 50,
                guidance_scale: data.guidanceScale || 3.5,
                num_images: data.count,
                enable_safety_checker: runtime.getSetting("FAL_AI_ENABLE_SAFETY_CHECKER") ===
                    "true",
                safety_tolerance: Number(runtime.getSetting("FAL_AI_SAFETY_TOLERANCE") || "2"),
                output_format: "png",
                seed: data.seed ?? 6252023,
                ...(runtime.getSetting("FAL_AI_LORA_PATH")
                    ? {
                        loras: [
                            {
                                path: runtime.getSetting("FAL_AI_LORA_PATH"),
                                scale: 1,
                            },
                        ],
                    }
                    : {}),
            };
            // Subscribe to the model
            const result = await client_1.fal.subscribe(model, {
                input,
                logs: true,
                onQueueUpdate: (update) => {
                    if (update.status === "IN_PROGRESS") {
                        index_ts_1.elizaLogger.info(update.logs.map((log) => log.message));
                    }
                },
            });
            // Convert the returned image URLs to base64 to match existing functionality
            const base64Promises = result.data.images.map(async (image) => {
                const response = await fetch(image.url);
                const blob = await response.blob();
                const buffer = await blob.arrayBuffer();
                const base64 = buffer_1.Buffer.from(buffer).toString("base64");
                return `data:${image.content_type};base64,${base64}`;
            });
            const base64s = await Promise.all(base64Promises);
            return { success: true, data: base64s };
        }
        else if (runtime.imageModelProvider === types_ts_1.ModelProviderName.VENICE) {
            const response = await fetch("https://api.venice.ai/api/v1/image/generate", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: model,
                    prompt: data.prompt,
                    cfg_scale: data.guidanceScale,
                    negative_prompt: data.negativePrompt,
                    width: data.width,
                    height: data.height,
                    steps: data.numIterations,
                    safe_mode: data.safeMode,
                    seed: data.seed,
                    style_preset: data.stylePreset,
                    hide_watermark: data.hideWatermark,
                }),
            });
            const result = await response.json();
            if (!result.images || !Array.isArray(result.images)) {
                throw new Error("Invalid response format from Venice AI");
            }
            const base64s = result.images.map((base64String) => {
                if (!base64String) {
                    throw new Error("Empty base64 string in Venice AI response");
                }
                return `data:image/png;base64,${base64String}`;
            });
            return { success: true, data: base64s };
        }
        else if (runtime.imageModelProvider === types_ts_1.ModelProviderName.NINETEEN_AI) {
            const response = await fetch("https://api.nineteen.ai/v1/text-to-image", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: model,
                    prompt: data.prompt,
                    negative_prompt: data.negativePrompt,
                    width: data.width,
                    height: data.height,
                    steps: data.numIterations,
                    cfg_scale: data.guidanceScale || 3,
                }),
            });
            const result = await response.json();
            if (!result.images || !Array.isArray(result.images)) {
                throw new Error("Invalid response format from Nineteen AI");
            }
            const base64s = result.images.map((base64String) => {
                if (!base64String) {
                    throw new Error("Empty base64 string in Nineteen AI response");
                }
                return `data:image/png;base64,${base64String}`;
            });
            return { success: true, data: base64s };
        }
        else if (runtime.imageModelProvider === types_ts_1.ModelProviderName.LIVEPEER) {
            if (!apiKey) {
                throw new Error("Livepeer Gateway is not defined");
            }
            try {
                const baseUrl = new URL(apiKey);
                if (!baseUrl.protocol.startsWith("http")) {
                    throw new Error("Invalid Livepeer Gateway URL protocol");
                }
                const response = await fetch(`${baseUrl.toString()}text-to-image`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer eliza-app-img",
                    },
                    body: JSON.stringify({
                        model_id: data.modelId || "ByteDance/SDXL-Lightning",
                        prompt: data.prompt,
                        width: data.width || 1024,
                        height: data.height || 1024,
                    }),
                });
                const result = await response.json();
                if (!result.images?.length) {
                    throw new Error("No images generated");
                }
                const base64Images = await Promise.all(result.images.map(async (image) => {
                    console.log("imageUrl console log", image.url);
                    let imageUrl;
                    if (image.url.includes("http")) {
                        imageUrl = image.url;
                    }
                    else {
                        imageUrl = `${apiKey}${image.url}`;
                    }
                    const imageResponse = await fetch(imageUrl);
                    if (!imageResponse.ok) {
                        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
                    }
                    const blob = await imageResponse.blob();
                    const arrayBuffer = await blob.arrayBuffer();
                    const base64 = buffer_1.Buffer.from(arrayBuffer).toString("base64");
                    return `data:image/jpeg;base64,${base64}`;
                }));
                return {
                    success: true,
                    data: base64Images,
                };
            }
            catch (error) {
                console.error(error);
                return { success: false, error: error };
            }
        }
        else {
            let targetSize = `${data.width}x${data.height}`;
            if (targetSize !== "1024x1024" &&
                targetSize !== "1792x1024" &&
                targetSize !== "1024x1792") {
                targetSize = "1024x1024";
            }
            const openaiApiKey = runtime.getSetting("OPENAI_API_KEY");
            if (!openaiApiKey) {
                throw new Error("OPENAI_API_KEY is not set");
            }
            const openai = new openai_2.default({
                apiKey: openaiApiKey,
            });
            const response = await openai.images.generate({
                model,
                prompt: data.prompt,
                size: targetSize,
                n: data.count,
                response_format: "b64_json",
            });
            const base64s = response.data.map((image) => `data:image/png;base64,${image.b64_json}`);
            return { success: true, data: base64s };
        }
    }
    catch (error) {
        console.error(error);
        return { success: false, error: error };
    }
};
exports.generateImage = generateImage;
const generateCaption = async (data, runtime) => {
    const { imageUrl } = data;
    const imageDescriptionService = runtime.getService(types_ts_1.ServiceType.IMAGE_DESCRIPTION);
    if (!imageDescriptionService) {
        throw new Error("Image description service not found");
    }
    const resp = await imageDescriptionService.describeImage(imageUrl);
    return {
        title: resp.title.trim(),
        description: resp.description.trim(),
    };
};
exports.generateCaption = generateCaption;
/**
 * Generates structured objects from a prompt using specified AI models and configuration options.
 *
 * @param {GenerationOptions} options - Configuration options for generating objects.
 * @returns {Promise<any[]>} - A promise that resolves to an array of generated objects.
 * @throws {Error} - Throws an error if the provider is unsupported or if generation fails.
 */
const generateObject = async ({ runtime, context, modelClass, schema, schemaName, schemaDescription, stop, mode = "json", verifiableInference = false, verifiableInferenceAdapter, verifiableInferenceOptions, }) => {
    if (!context) {
        const errorMessage = "generateObject context is empty";
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    const provider = runtime.modelProvider;
    const modelSettings = (0, models_ts_1.getModelSettings)(runtime.modelProvider, modelClass);
    const model = modelSettings.name;
    const temperature = modelSettings.temperature;
    const frequency_penalty = modelSettings.frequency_penalty;
    const presence_penalty = modelSettings.presence_penalty;
    const max_context_length = modelSettings.maxInputTokens;
    const max_response_length = modelSettings.maxOutputTokens;
    const experimental_telemetry = modelSettings.experimental_telemetry;
    const apiKey = runtime.token;
    try {
        context = await trimTokens(context, max_context_length, runtime);
        const modelOptions = {
            prompt: context,
            temperature,
            maxTokens: max_response_length,
            frequencyPenalty: frequency_penalty,
            presencePenalty: presence_penalty,
            stop: stop || modelSettings.stop,
            experimental_telemetry: experimental_telemetry,
        };
        const response = await handleProvider({
            provider,
            model,
            apiKey,
            schema,
            schemaName,
            schemaDescription,
            mode,
            modelOptions,
            runtime,
            context,
            modelClass,
            verifiableInference,
            verifiableInferenceAdapter,
            verifiableInferenceOptions,
        });
        return response;
    }
    catch (error) {
        console.error("Error in generateObject:", error);
        throw error;
    }
};
exports.generateObject = generateObject;
/**
 * Handles AI generation based on the specified provider.
 *
 * @param {ProviderOptions} options - Configuration options specific to the provider.
 * @returns {Promise<any[]>} - A promise that resolves to an array of generated objects.
 */
async function handleProvider(options) {
    const { provider, runtime, context, modelClass,
    //verifiableInference,
    //verifiableInferenceAdapter,
    //verifiableInferenceOptions,
     } = options;
    switch (provider) {
        case types_ts_1.ModelProviderName.OPENAI:
        case types_ts_1.ModelProviderName.ETERNALAI:
        case types_ts_1.ModelProviderName.ALI_BAILIAN:
        case types_ts_1.ModelProviderName.VOLENGINE:
        case types_ts_1.ModelProviderName.LLAMACLOUD:
        case types_ts_1.ModelProviderName.TOGETHER:
        case types_ts_1.ModelProviderName.NANOGPT:
        case types_ts_1.ModelProviderName.AKASH_CHAT_API:
        case types_ts_1.ModelProviderName.LMSTUDIO:
            return await handleOpenAI(options);
        case types_ts_1.ModelProviderName.ANTHROPIC:
        case types_ts_1.ModelProviderName.CLAUDE_VERTEX:
            return await handleAnthropic(options);
        case types_ts_1.ModelProviderName.GROK:
            return await handleGrok(options);
        case types_ts_1.ModelProviderName.GROQ:
            return await handleGroq(options);
        case types_ts_1.ModelProviderName.LLAMALOCAL:
            return await generateObjectDeprecated({
                runtime,
                context,
                modelClass,
            });
        case types_ts_1.ModelProviderName.GOOGLE:
            return await handleGoogle(options);
        case types_ts_1.ModelProviderName.MISTRAL:
            return await handleMistral(options);
        case types_ts_1.ModelProviderName.REDPILL:
            return await handleRedPill(options);
        case types_ts_1.ModelProviderName.OPENROUTER:
            return await handleOpenRouter(options);
        case types_ts_1.ModelProviderName.OLLAMA:
            return await handleOllama(options);
        case types_ts_1.ModelProviderName.DEEPSEEK:
            return await handleDeepSeek(options);
        case types_ts_1.ModelProviderName.LIVEPEER:
            return await handleLivepeer(options);
        default: {
            const errorMessage = `Unsupported provider: ${provider}`;
            index_ts_1.elizaLogger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }
}
/**
 * Handles object generation for OpenAI.
 *
 * @param {ProviderOptions} options - Options specific to OpenAI.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleOpenAI({ model, apiKey, schema, schemaName, schemaDescription, mode = "json", modelOptions, provider, runtime, }) {
    const endpoint = runtime.character.modelEndpointOverride || (0, models_ts_1.getEndpoint)(provider);
    const baseURL = getCloudflareGatewayBaseURL(runtime, "openai") || endpoint;
    const openai = (0, openai_1.createOpenAI)({ apiKey, baseURL });
    return await (0, ai_1.generateObject)({
        model: openai.languageModel(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for Anthropic models.
 *
 * @param {ProviderOptions} options - Options specific to Anthropic.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleAnthropic({ model, apiKey, schema, schemaName, schemaDescription, mode = "auto", modelOptions, runtime, }) {
    index_ts_1.elizaLogger.debug("Handling Anthropic request with Cloudflare check");
    if (mode === "json") {
        index_ts_1.elizaLogger.warn("Anthropic mode is set to json, changing to auto");
        mode = "auto";
    }
    const baseURL = getCloudflareGatewayBaseURL(runtime, "anthropic");
    index_ts_1.elizaLogger.debug("Anthropic handleAnthropic baseURL:", { baseURL });
    const anthropic = (0, anthropic_1.createAnthropic)({ apiKey, baseURL });
    return await (0, ai_1.generateObject)({
        model: anthropic.languageModel(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for Grok models.
 *
 * @param {ProviderOptions} options - Options specific to Grok.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleGrok({ model, apiKey, schema, schemaName, schemaDescription, mode = "json", modelOptions, }) {
    const grok = (0, openai_1.createOpenAI)({ apiKey, baseURL: models_ts_1.models.grok.endpoint });
    return await (0, ai_1.generateObject)({
        model: grok.languageModel(model, { parallelToolCalls: false }),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for Groq models.
 *
 * @param {ProviderOptions} options - Options specific to Groq.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleGroq({ model, apiKey, schema, schemaName, schemaDescription, mode = "json", modelOptions, runtime, }) {
    index_ts_1.elizaLogger.debug("Handling Groq request with Cloudflare check");
    const baseURL = getCloudflareGatewayBaseURL(runtime, "groq");
    index_ts_1.elizaLogger.debug("Groq handleGroq baseURL:", { baseURL });
    const groq = (0, groq_1.createGroq)({ apiKey, baseURL });
    return await (0, ai_1.generateObject)({
        model: groq.languageModel(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for Google models.
 *
 * @param {ProviderOptions} options - Options specific to Google.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleGoogle({ model, apiKey, schema, schemaName, schemaDescription, mode = "json", modelOptions, }) {
    const google = (0, google_1.createGoogleGenerativeAI)({ apiKey });
    return await (0, ai_1.generateObject)({
        model: google(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for Mistral models.
 *
 * @param {ProviderOptions} options - Options specific to Mistral.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleMistral({ model, schema, schemaName, schemaDescription, mode, modelOptions, }) {
    const mistral = (0, mistral_1.createMistral)();
    return await (0, ai_1.generateObject)({
        model: mistral(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for Redpill models.
 *
 * @param {ProviderOptions} options - Options specific to Redpill.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleRedPill({ model, apiKey, schema, schemaName, schemaDescription, mode = "json", modelOptions, }) {
    const redPill = (0, openai_1.createOpenAI)({ apiKey, baseURL: models_ts_1.models.redpill.endpoint });
    return await (0, ai_1.generateObject)({
        model: redPill.languageModel(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for OpenRouter models.
 *
 * @param {ProviderOptions} options - Options specific to OpenRouter.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleOpenRouter({ model, apiKey, schema, schemaName, schemaDescription, mode = "json", modelOptions, }) {
    const openRouter = (0, openai_1.createOpenAI)({
        apiKey,
        baseURL: models_ts_1.models.openrouter.endpoint,
    });
    return await (0, ai_1.generateObject)({
        model: openRouter.languageModel(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for Ollama models.
 *
 * @param {ProviderOptions} options - Options specific to Ollama.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleOllama({ model, schema, schemaName, schemaDescription, mode = "json", modelOptions, provider, }) {
    const ollamaProvider = (0, ollama_ai_provider_1.createOllama)({
        baseURL: (0, models_ts_1.getEndpoint)(provider) + "/api",
    });
    const ollama = ollamaProvider(model);
    return await (0, ai_1.generateObject)({
        model: ollama,
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for DeepSeek models.
 *
 * @param {ProviderOptions} options - Options specific to DeepSeek.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleDeepSeek({ model, apiKey, schema, schemaName, schemaDescription, mode, modelOptions, }) {
    const openai = (0, openai_1.createOpenAI)({ apiKey, baseURL: models_ts_1.models.deepseek.endpoint });
    return await (0, ai_1.generateObject)({
        model: openai.languageModel(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
/**
 * Handles object generation for Amazon Bedrock models.
 *
 * @param {ProviderOptions} options - Options specific to Amazon Bedrock.
 * @returns {Promise<GenerateObjectResult<unknown>>} - A promise that resolves to generated objects.
 */
async function handleBedrock({ model, schema, schemaName, schemaDescription, mode, modelOptions, provider, }) {
    return await (0, ai_1.generateObject)({
        model: (0, amazon_bedrock_1.bedrock)(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
async function handleLivepeer({ model, apiKey, schema, schemaName, schemaDescription, mode, modelOptions, }) {
    console.log("Livepeer provider api key:", apiKey);
    if (!apiKey) {
        throw new Error("Livepeer provider requires LIVEPEER_GATEWAY_URL to be configured");
    }
    const livepeerClient = (0, openai_1.createOpenAI)({
        apiKey,
        baseURL: apiKey, // Use the apiKey as the baseURL since it contains the gateway URL
    });
    return await (0, ai_1.generateObject)({
        model: livepeerClient.languageModel(model),
        schema,
        schemaName,
        schemaDescription,
        mode,
        ...modelOptions,
    });
}
async function generateTweetActions({ runtime, context, modelClass, }) {
    let retryDelay = 1000;
    while (true) {
        try {
            const response = await generateText({
                runtime,
                context,
                modelClass,
            });
            index_ts_1.elizaLogger.debug("Received response from generateText for tweet actions:", response);
            const { actions } = (0, parsing_ts_1.parseActionResponseFromText)(response.trim());
            if (actions) {
                index_ts_1.elizaLogger.debug("Parsed tweet actions:", actions);
                return actions;
            }
            else {
                index_ts_1.elizaLogger.debug("generateTweetActions no valid response");
            }
        }
        catch (error) {
            index_ts_1.elizaLogger.error("Error in generateTweetActions:", error);
            if (error instanceof TypeError &&
                error.message.includes("queueTextCompletion")) {
                index_ts_1.elizaLogger.error("TypeError: Cannot read properties of null (reading 'queueTextCompletion')");
            }
        }
        index_ts_1.elizaLogger.log(`Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2;
    }
}
