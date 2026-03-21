"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbeddingConfig = exports.EmbeddingProvider = void 0;
exports.getEmbeddingType = getEmbeddingType;
exports.getEmbeddingZeroVector = getEmbeddingZeroVector;
exports.embed = embed;
const models_ts_1 = require("./models.ts");
const types_ts_1 = require("./types.ts");
const settings_ts_1 = __importDefault(require("./settings.ts"));
const logger_ts_1 = __importDefault(require("./logger.ts"));
const localembeddingManager_ts_1 = __importDefault(require("./localembeddingManager.ts"));
exports.EmbeddingProvider = {
    OpenAI: "OpenAI",
    Ollama: "Ollama",
    GaiaNet: "GaiaNet",
    Heurist: "Heurist",
    BGE: "BGE",
};
const getEmbeddingConfig = () => ({
    dimensions: settings_ts_1.default.USE_OPENAI_EMBEDDING?.toLowerCase() === "true"
        ? (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.OPENAI).dimensions
        : settings_ts_1.default.USE_OLLAMA_EMBEDDING?.toLowerCase() === "true"
            ? (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.OLLAMA).dimensions
            : settings_ts_1.default.USE_GAIANET_EMBEDDING?.toLowerCase() === "true"
                ? (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.GAIANET)
                    .dimensions
                : settings_ts_1.default.USE_HEURIST_EMBEDDING?.toLowerCase() === "true"
                    ? (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.HEURIST)
                        .dimensions
                    : 384, // BGE
    model: settings_ts_1.default.USE_OPENAI_EMBEDDING?.toLowerCase() === "true"
        ? (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.OPENAI).name
        : settings_ts_1.default.USE_OLLAMA_EMBEDDING?.toLowerCase() === "true"
            ? (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.OLLAMA).name
            : settings_ts_1.default.USE_GAIANET_EMBEDDING?.toLowerCase() === "true"
                ? (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.GAIANET).name
                : settings_ts_1.default.USE_HEURIST_EMBEDDING?.toLowerCase() === "true"
                    ? (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.HEURIST).name
                    : "BGE-small-en-v1.5",
    provider: settings_ts_1.default.USE_OPENAI_EMBEDDING?.toLowerCase() === "true"
        ? "OpenAI"
        : settings_ts_1.default.USE_OLLAMA_EMBEDDING?.toLowerCase() === "true"
            ? "Ollama"
            : settings_ts_1.default.USE_GAIANET_EMBEDDING?.toLowerCase() === "true"
                ? "GaiaNet"
                : settings_ts_1.default.USE_HEURIST_EMBEDDING?.toLowerCase() === "true"
                    ? "Heurist"
                    : "BGE",
});
exports.getEmbeddingConfig = getEmbeddingConfig;
async function getRemoteEmbedding(input, options) {
    // Ensure endpoint ends with /v1 for OpenAI
    const baseEndpoint = options.endpoint.endsWith("/v1")
        ? options.endpoint
        : `${options.endpoint}${options.isOllama ? "/v1" : ""}`;
    // Construct full URL
    const fullUrl = `${baseEndpoint}/embeddings`;
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(options.apiKey
                ? {
                    Authorization: `Bearer ${options.apiKey}`,
                }
                : {}),
        },
        body: JSON.stringify({
            input,
            model: options.model,
            dimensions: options.dimensions ||
                options.length ||
                (0, exports.getEmbeddingConfig)().dimensions, // Prefer dimensions, fallback to length
        }),
    };
    try {
        const response = await fetch(fullUrl, requestOptions);
        if (!response.ok) {
            logger_ts_1.default.error("API Response:", await response.text()); // Debug log
            throw new Error(`Embedding API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data?.data?.[0].embedding;
    }
    catch (e) {
        logger_ts_1.default.error("Full error details:", e);
        throw e;
    }
}
function getEmbeddingType(runtime) {
    const isNode = typeof process !== "undefined" &&
        process.versions != null &&
        process.versions.node != null;
    // Use local embedding if:
    // - Running in Node.js
    // - Not using OpenAI provider
    // - Not forcing OpenAI embeddings
    const isLocal = isNode &&
        runtime.character.modelProvider !== types_ts_1.ModelProviderName.OPENAI &&
        runtime.character.modelProvider !== types_ts_1.ModelProviderName.GAIANET &&
        runtime.character.modelProvider !== types_ts_1.ModelProviderName.HEURIST &&
        !settings_ts_1.default.USE_OPENAI_EMBEDDING;
    return isLocal ? "local" : "remote";
}
function getEmbeddingZeroVector() {
    let embeddingDimension = 384; // Default BGE dimension
    if (settings_ts_1.default.USE_OPENAI_EMBEDDING?.toLowerCase() === "true") {
        embeddingDimension = (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.OPENAI).dimensions; // OpenAI dimension
    }
    else if (settings_ts_1.default.USE_OLLAMA_EMBEDDING?.toLowerCase() === "true") {
        embeddingDimension = (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.OLLAMA).dimensions; // Ollama mxbai-embed-large dimension
    }
    else if (settings_ts_1.default.USE_GAIANET_EMBEDDING?.toLowerCase() === "true") {
        embeddingDimension = (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.GAIANET).dimensions; // GaiaNet dimension
    }
    else if (settings_ts_1.default.USE_HEURIST_EMBEDDING?.toLowerCase() === "true") {
        embeddingDimension = (0, models_ts_1.getEmbeddingModelSettings)(types_ts_1.ModelProviderName.HEURIST).dimensions; // Heurist dimension
    }
    return Array(embeddingDimension).fill(0);
}
/**
 * Gets embeddings from a remote API endpoint.  Falls back to local BGE/384
 *
 * @param {string} input - The text to generate embeddings for
 * @param {EmbeddingOptions} options - Configuration options including:
 *   - model: The model name to use
 *   - endpoint: Base API endpoint URL
 *   - apiKey: Optional API key for authentication
 *   - isOllama: Whether this is an Ollama endpoint
 *   - dimensions: Desired embedding dimensions
 * @param {IAgentRuntime} runtime - The agent runtime context
 * @returns {Promise<number[]>} Array of embedding values
 * @throws {Error} If the API request fails
 */
async function embed(runtime, input) {
    logger_ts_1.default.debug("Embedding request:", {
        modelProvider: runtime.character.modelProvider,
        useOpenAI: process.env.USE_OPENAI_EMBEDDING,
        input: input?.slice(0, 50) + "...",
        inputType: typeof input,
        inputLength: input?.length,
        isString: typeof input === "string",
        isEmpty: !input,
    });
    // Validate input
    if (!input || typeof input !== "string" || input.trim().length === 0) {
        logger_ts_1.default.warn("Invalid embedding input:", {
            input,
            type: typeof input,
            length: input?.length,
        });
        return []; // Return empty embedding array
    }
    // Check cache first
    const cachedEmbedding = await retrieveCachedEmbedding(runtime, input);
    if (cachedEmbedding)
        return cachedEmbedding;
    const config = (0, exports.getEmbeddingConfig)();
    const isNode = typeof process !== "undefined" && process.versions?.node;
    // Determine which embedding path to use
    if (config.provider === exports.EmbeddingProvider.OpenAI) {
        return await getRemoteEmbedding(input, {
            model: config.model,
            endpoint: settings_ts_1.default.OPENAI_API_URL || "https://api.openai.com/v1",
            apiKey: settings_ts_1.default.OPENAI_API_KEY,
            dimensions: config.dimensions,
        });
    }
    if (config.provider === exports.EmbeddingProvider.Ollama) {
        return await getRemoteEmbedding(input, {
            model: config.model,
            endpoint: runtime.character.modelEndpointOverride ||
                (0, models_ts_1.getEndpoint)(types_ts_1.ModelProviderName.OLLAMA),
            isOllama: true,
            dimensions: config.dimensions,
        });
    }
    if (config.provider == exports.EmbeddingProvider.GaiaNet) {
        return await getRemoteEmbedding(input, {
            model: config.model,
            endpoint: runtime.character.modelEndpointOverride ||
                (0, models_ts_1.getEndpoint)(types_ts_1.ModelProviderName.GAIANET) ||
                settings_ts_1.default.SMALL_GAIANET_SERVER_URL ||
                settings_ts_1.default.MEDIUM_GAIANET_SERVER_URL ||
                settings_ts_1.default.LARGE_GAIANET_SERVER_URL,
            apiKey: settings_ts_1.default.GAIANET_API_KEY || runtime.token,
            dimensions: config.dimensions,
        });
    }
    if (config.provider === exports.EmbeddingProvider.Heurist) {
        return await getRemoteEmbedding(input, {
            model: config.model,
            endpoint: (0, models_ts_1.getEndpoint)(types_ts_1.ModelProviderName.HEURIST),
            apiKey: runtime.token,
            dimensions: config.dimensions,
        });
    }
    // BGE - try local first if in Node
    if (isNode) {
        try {
            return await getLocalEmbedding(input);
        }
        catch (error) {
            logger_ts_1.default.warn("Local embedding failed, falling back to remote", error);
        }
    }
    // Fallback to remote override
    return await getRemoteEmbedding(input, {
        model: config.model,
        endpoint: runtime.character.modelEndpointOverride ||
            (0, models_ts_1.getEndpoint)(runtime.character.modelProvider),
        apiKey: runtime.token,
        dimensions: config.dimensions,
    });
    async function getLocalEmbedding(input) {
        logger_ts_1.default.debug("DEBUG - Inside getLocalEmbedding function");
        try {
            const embeddingManager = localembeddingManager_ts_1.default.getInstance();
            return await embeddingManager.generateEmbedding(input);
        }
        catch (error) {
            logger_ts_1.default.error("Local embedding failed:", error);
            throw error;
        }
    }
    async function retrieveCachedEmbedding(runtime, input) {
        if (!input) {
            logger_ts_1.default.log("No input to retrieve cached embedding for");
            return null;
        }
        const similaritySearchResult = await runtime.messageManager.getCachedEmbeddings(input);
        if (similaritySearchResult.length > 0) {
            return similaritySearchResult[0].embedding;
        }
        return null;
    }
}
