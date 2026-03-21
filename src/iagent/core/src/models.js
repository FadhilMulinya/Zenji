"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
exports.getModelSettings = getModelSettings;
exports.getImageModelSettings = getImageModelSettings;
exports.getEmbeddingModelSettings = getEmbeddingModelSettings;
exports.getEndpoint = getEndpoint;
const settings_ts_1 = __importDefault(require("./settings.ts"));
const types_ts_1 = require("./types.ts");
exports.models = {
    [types_ts_1.ModelProviderName.OPENAI]: {
        endpoint: settings_ts_1.default.OPENAI_API_URL || "https://api.openai.com/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_OPENAI_MODEL || "gpt-4o-mini",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_OPENAI_MODEL || "gpt-4o",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_OPENAI_MODEL || "gpt-4o",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: settings_ts_1.default.EMBEDDING_OPENAI_MODEL || "text-embedding-3-small",
                dimensions: 1536,
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: settings_ts_1.default.IMAGE_OPENAI_MODEL || "dall-e-3",
            },
        },
    },
    [types_ts_1.ModelProviderName.ETERNALAI]: {
        endpoint: settings_ts_1.default.ETERNALAI_URL,
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.ETERNALAI_MODEL ||
                    "neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.ETERNALAI_MODEL ||
                    "neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.ETERNALAI_MODEL ||
                    "neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
        },
    },
    [types_ts_1.ModelProviderName.ANTHROPIC]: {
        endpoint: "https://api.anthropic.com/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_ANTHROPIC_MODEL || "claude-3-haiku-20240307",
                stop: [],
                maxInputTokens: 200000,
                maxOutputTokens: 4096,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_ANTHROPIC_MODEL ||
                    "claude-3-5-sonnet-20241022",
                stop: [],
                maxInputTokens: 200000,
                maxOutputTokens: 4096,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_ANTHROPIC_MODEL ||
                    "claude-3-5-sonnet-20241022",
                stop: [],
                maxInputTokens: 200000,
                maxOutputTokens: 4096,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
        },
    },
    [types_ts_1.ModelProviderName.CLAUDE_VERTEX]: {
        endpoint: "https://api.anthropic.com/v1", // TODO: check
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: "claude-3-5-sonnet-20241022",
                stop: [],
                maxInputTokens: 200000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: "claude-3-5-sonnet-20241022",
                stop: [],
                maxInputTokens: 200000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: "claude-3-opus-20240229",
                stop: [],
                maxInputTokens: 200000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
        },
    },
    [types_ts_1.ModelProviderName.GROK]: {
        endpoint: "https://api.x.ai/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_GROK_MODEL || "grok-2-1212",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_GROK_MODEL || "grok-2-1212",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_GROK_MODEL || "grok-2-1212",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: settings_ts_1.default.EMBEDDING_GROK_MODEL || "grok-2-1212", // not sure about this one
            },
        },
    },
    [types_ts_1.ModelProviderName.GROQ]: {
        endpoint: "https://api.groq.com/openai/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_GROQ_MODEL || "llama-3.1-8b-instant",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8000,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_GROQ_MODEL || "llama-3.3-70b-versatile",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8000,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_GROQ_MODEL || "llama-3.2-90b-vision-preview",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8000,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: settings_ts_1.default.EMBEDDING_GROQ_MODEL || "llama-3.1-8b-instant",
            },
        },
    },
    [types_ts_1.ModelProviderName.LLAMACLOUD]: {
        endpoint: "https://api.llamacloud.com/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: "meta-llama-3.1-8b-instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: "togethercomputer/m2-bert-80M-32k-retrieval",
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: "black-forest-labs/FLUX.1-schnell",
                steps: 4,
            },
        },
    },
    [types_ts_1.ModelProviderName.TOGETHER]: {
        endpoint: "https://api.together.ai/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo-128K",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: "togethercomputer/m2-bert-80M-32k-retrieval",
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: "black-forest-labs/FLUX.1-schnell",
                steps: 4,
            },
        },
    },
    [types_ts_1.ModelProviderName.LLAMALOCAL]: {
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: "NousResearch/Hermes-3-Llama-3.1-8B-GGUF/resolve/main/Hermes-3-Llama-3.1-8B.Q8_0.gguf?download=true",
                stop: ["<|eot_id|>", "<|eom_id|>"],
                maxInputTokens: 32768,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: "NousResearch/Hermes-3-Llama-3.1-8B-GGUF/resolve/main/Hermes-3-Llama-3.1-8B.Q8_0.gguf?download=true", // TODO: ?download=true
                stop: ["<|eot_id|>", "<|eom_id|>"],
                maxInputTokens: 32768,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: "NousResearch/Hermes-3-Llama-3.1-8B-GGUF/resolve/main/Hermes-3-Llama-3.1-8B.Q8_0.gguf?download=true", // "RichardErkhov/NousResearch_-_Meta-Llama-3.1-70B-gguf", // TODO:
                stop: ["<|eot_id|>", "<|eom_id|>"],
                maxInputTokens: 32768,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: "togethercomputer/m2-bert-80M-32k-retrieval",
            },
        },
    },
    [types_ts_1.ModelProviderName.LMSTUDIO]: {
        endpoint: settings_ts_1.default.LMSTUDIO_SERVER_URL || "http://localhost:1234/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_LMSTUDIO_MODEL || settings_ts_1.default.LMSTUDIO_MODEL || "hermes-3-llama-3.1-8b",
                stop: ["<|eot_id|>", "<|eom_id|>"],
                maxInputTokens: 32768,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_LMSTUDIO_MODEL || settings_ts_1.default.LMSTUDIO_MODEL || "hermes-3-llama-3.1-8b",
                stop: ["<|eot_id|>", "<|eom_id|>"],
                maxInputTokens: 32768,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_LMSTUDIO_MODEL || settings_ts_1.default.LMSTUDIO_MODEL || "hermes-3-llama-3.1-8b",
                stop: ["<|eot_id|>", "<|eom_id|>"],
                maxInputTokens: 32768,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
        },
    },
    [types_ts_1.ModelProviderName.GOOGLE]: {
        endpoint: "https://generativelanguage.googleapis.com",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_GOOGLE_MODEL ||
                    settings_ts_1.default.GOOGLE_MODEL ||
                    "gemini-2.0-flash-exp",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_GOOGLE_MODEL ||
                    settings_ts_1.default.GOOGLE_MODEL ||
                    "gemini-2.0-flash-exp",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_GOOGLE_MODEL ||
                    settings_ts_1.default.GOOGLE_MODEL ||
                    "gemini-2.0-flash-exp",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: settings_ts_1.default.EMBEDDING_GOOGLE_MODEL ||
                    settings_ts_1.default.GOOGLE_MODEL ||
                    "text-embedding-004",
            },
        },
    },
    [types_ts_1.ModelProviderName.MISTRAL]: {
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_MISTRAL_MODEL ||
                    settings_ts_1.default.MISTRAL_MODEL ||
                    "mistral-small-latest",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_MISTRAL_MODEL ||
                    settings_ts_1.default.MISTRAL_MODEL ||
                    "mistral-large-latest",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_MISTRAL_MODEL ||
                    settings_ts_1.default.MISTRAL_MODEL ||
                    "mistral-large-latest",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
        },
    },
    [types_ts_1.ModelProviderName.REDPILL]: {
        endpoint: "https://api.red-pill.ai/v1",
        // Available models: https://docs.red-pill.ai/get-started/supported-models
        // To test other models, change the models below
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_REDPILL_MODEL ||
                    settings_ts_1.default.REDPILL_MODEL ||
                    "gpt-4o-mini",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_REDPILL_MODEL ||
                    settings_ts_1.default.REDPILL_MODEL ||
                    "gpt-4o",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_REDPILL_MODEL ||
                    settings_ts_1.default.REDPILL_MODEL ||
                    "gpt-4o",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: "text-embedding-3-small",
            },
        },
    },
    [types_ts_1.ModelProviderName.OPENROUTER]: {
        endpoint: "https://openrouter.ai/api/v1",
        // Available models: https://openrouter.ai/models
        // To test other models, change the models below
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_OPENROUTER_MODEL ||
                    settings_ts_1.default.OPENROUTER_MODEL ||
                    "nousresearch/hermes-3-llama-3.1-405b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_OPENROUTER_MODEL ||
                    settings_ts_1.default.OPENROUTER_MODEL ||
                    "nousresearch/hermes-3-llama-3.1-405b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_OPENROUTER_MODEL ||
                    settings_ts_1.default.OPENROUTER_MODEL ||
                    "nousresearch/hermes-3-llama-3.1-405b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: "text-embedding-3-small",
            },
        },
    },
    [types_ts_1.ModelProviderName.OLLAMA]: {
        endpoint: settings_ts_1.default.OLLAMA_SERVER_URL || "http://localhost:11434",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_OLLAMA_MODEL ||
                    settings_ts_1.default.OLLAMA_MODEL ||
                    "llama3.2",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_OLLAMA_MODEL ||
                    settings_ts_1.default.OLLAMA_MODEL ||
                    "hermes3",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_OLLAMA_MODEL ||
                    settings_ts_1.default.OLLAMA_MODEL ||
                    "hermes3:70b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: settings_ts_1.default.OLLAMA_EMBEDDING_MODEL || "mxbai-embed-large",
                dimensions: 1024,
            },
        },
    },
    [types_ts_1.ModelProviderName.HEURIST]: {
        endpoint: "https://llm-gateway.heurist.xyz",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_HEURIST_MODEL ||
                    "meta-llama/llama-3-70b-instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_HEURIST_MODEL ||
                    "meta-llama/llama-3-70b-instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_HEURIST_MODEL ||
                    "meta-llama/llama-3.3-70b-instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: settings_ts_1.default.HEURIST_IMAGE_MODEL || "FLUX.1-dev",
                steps: 20,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: "BAAI/bge-large-en-v1.5",
                dimensions: 1024,
            },
        },
    },
    [types_ts_1.ModelProviderName.GALADRIEL]: {
        endpoint: "https://api.galadriel.com/v1/verified",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_GALADRIEL_MODEL || "gpt-4o-mini",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_GALADRIEL_MODEL || "gpt-4o",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_GALADRIEL_MODEL || "gpt-4o",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
        },
    },
    [types_ts_1.ModelProviderName.FAL]: {
        endpoint: "https://api.fal.ai/v1",
        model: {
            [types_ts_1.ModelClass.IMAGE]: { name: "fal-ai/flux-lora", steps: 28 },
        },
    },
    [types_ts_1.ModelProviderName.GAIANET]: {
        endpoint: settings_ts_1.default.GAIANET_SERVER_URL,
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.GAIANET_MODEL ||
                    settings_ts_1.default.SMALL_GAIANET_MODEL ||
                    "llama3b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.GAIANET_MODEL ||
                    settings_ts_1.default.MEDIUM_GAIANET_MODEL ||
                    "llama",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.GAIANET_MODEL ||
                    settings_ts_1.default.LARGE_GAIANET_MODEL ||
                    "qwen72b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                repetition_penalty: 0.4,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: settings_ts_1.default.GAIANET_EMBEDDING_MODEL || "nomic-embed",
                dimensions: 768,
            },
        },
    },
    [types_ts_1.ModelProviderName.ALI_BAILIAN]: {
        endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: "qwen-turbo",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: "qwen-plus",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: "qwen-max",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: "wanx-v1",
            },
        },
    },
    [types_ts_1.ModelProviderName.VOLENGINE]: {
        endpoint: settings_ts_1.default.VOLENGINE_API_URL ||
            "https://open.volcengineapi.com/api/v3/",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_VOLENGINE_MODEL ||
                    settings_ts_1.default.VOLENGINE_MODEL ||
                    "doubao-lite-128k",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_VOLENGINE_MODEL ||
                    settings_ts_1.default.VOLENGINE_MODEL ||
                    "doubao-pro-128k",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_VOLENGINE_MODEL ||
                    settings_ts_1.default.VOLENGINE_MODEL ||
                    "doubao-pro-256k",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.4,
                presence_penalty: 0.4,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: settings_ts_1.default.VOLENGINE_EMBEDDING_MODEL || "doubao-embedding",
            },
        },
    },
    [types_ts_1.ModelProviderName.NANOGPT]: {
        endpoint: "https://nano-gpt.com/api/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_NANOGPT_MODEL || "gpt-4o-mini",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_NANOGPT_MODEL || "gpt-4o",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_NANOGPT_MODEL || "gpt-4o",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
            },
        },
    },
    [types_ts_1.ModelProviderName.HYPERBOLIC]: {
        endpoint: "https://api.hyperbolic.xyz/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_HYPERBOLIC_MODEL ||
                    settings_ts_1.default.HYPERBOLIC_MODEL ||
                    "meta-llama/Llama-3.2-3B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_HYPERBOLIC_MODEL ||
                    settings_ts_1.default.HYPERBOLIC_MODEL ||
                    "meta-llama/Meta-Llama-3.1-70B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_HYPERBOLIC_MODEL ||
                    settings_ts_1.default.HYPERBOLIC_MODEL ||
                    "meta-llama/Meta-Llama-3.1-405-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: settings_ts_1.default.IMAGE_HYPERBOLIC_MODEL || "FLUX.1-dev",
            },
        },
    },
    [types_ts_1.ModelProviderName.VENICE]: {
        endpoint: "https://api.venice.ai/api/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_VENICE_MODEL || "llama-3.3-70b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_VENICE_MODEL || "llama-3.3-70b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_VENICE_MODEL || "llama-3.1-405b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: settings_ts_1.default.IMAGE_VENICE_MODEL || "fluently-xl",
            },
        },
    },
    [types_ts_1.ModelProviderName.NVIDIA]: {
        endpoint: "https://integrate.api.nvidia.com/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_NVIDIA_MODEL || "meta/llama-3.2-3b-instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_NVIDIA_MODEL || "meta/llama-3.3-70b-instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_NVIDIA_MODEL || "meta/llama-3.1-405b-instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
        },
    },
    [types_ts_1.ModelProviderName.NINETEEN_AI]: {
        endpoint: "https://api.nineteen.ai/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_NINETEEN_AI_MODEL ||
                    "unsloth/Llama-3.2-3B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_NINETEEN_AI_MODEL ||
                    "unsloth/Meta-Llama-3.1-8B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_NINETEEN_AI_MODEL ||
                    "hugging-quants/Meta-Llama-3.1-70B-Instruct-AWQ-INT4",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: settings_ts_1.default.IMAGE_NINETEEN_AI_MODEL ||
                    "dataautogpt3/ProteusV0.4-Lightning",
            },
        },
    },
    [types_ts_1.ModelProviderName.AKASH_CHAT_API]: {
        endpoint: "https://chatapi.akash.network/api/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_AKASH_CHAT_API_MODEL ||
                    "Meta-Llama-3-2-3B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_AKASH_CHAT_API_MODEL ||
                    "Meta-Llama-3-3-70B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_AKASH_CHAT_API_MODEL ||
                    "Meta-Llama-3-1-405B-Instruct-FP8",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.6,
            },
        },
    },
    [types_ts_1.ModelProviderName.LIVEPEER]: {
        endpoint: settings_ts_1.default.LIVEPEER_GATEWAY_URL || "http://gateway.test-gateway",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_LIVEPEER_MODEL ||
                    "meta-llama/Meta-Llama-3.1-8B-Instruct",
                stop: [],
                maxInputTokens: 8000,
                maxOutputTokens: 8192,
                temperature: 0,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_LIVEPEER_MODEL ||
                    "meta-llama/Meta-Llama-3.1-8B-Instruct",
                stop: [],
                maxInputTokens: 8000,
                maxOutputTokens: 8192,
                temperature: 0,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_LIVEPEER_MODEL ||
                    "meta-llama/Meta-Llama-3.1-8B-Instruct",
                stop: [],
                maxInputTokens: 8000,
                maxOutputTokens: 8192,
                temperature: 0,
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: settings_ts_1.default.IMAGE_LIVEPEER_MODEL || "ByteDance/SDXL-Lightning",
            },
        },
    },
    [types_ts_1.ModelProviderName.INFERA]: {
        endpoint: "https://api.infera.org",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_INFERA_MODEL || "llama3.2:3b",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_INFERA_MODEL || "mistral-nemo:latest",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_INFERA_MODEL || "mistral-small:latest",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0,
            },
        },
    },
    [types_ts_1.ModelProviderName.DEEPSEEK]: {
        endpoint: settings_ts_1.default.DEEPSEEK_API_URL || "https://api.deepseek.com",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_DEEPSEEK_MODEL || "deepseek-chat",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_DEEPSEEK_MODEL || "deepseek-chat",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_DEEPSEEK_MODEL || "deepseek-chat",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.7,
            },
        },
    },
    [types_ts_1.ModelProviderName.BEDROCK]: {
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_BEDROCK_MODEL || "amazon.nova-micro-v1:0",
                maxInputTokens: 128000,
                maxOutputTokens: 5120,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
                stop: [],
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_BEDROCK_MODEL || "amazon.nova-lite-v1:0",
                maxInputTokens: 128000,
                maxOutputTokens: 5120,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
                stop: [],
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_BEDROCK_MODEL || "amazon.nova-pro-v1:0",
                maxInputTokens: 128000,
                maxOutputTokens: 5120,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
                temperature: 0.6,
                stop: [],
            },
            [types_ts_1.ModelClass.EMBEDDING]: {
                name: settings_ts_1.default.EMBEDDING_BEDROCK_MODEL ||
                    "amazon.titan-embed-text-v1",
            },
            [types_ts_1.ModelClass.IMAGE]: {
                name: settings_ts_1.default.IMAGE_BEDROCK_MODEL || "amazon.nova-canvas-v1:0",
            },
        },
    },
    [types_ts_1.ModelProviderName.ATOMA]: {
        endpoint: settings_ts_1.default.ATOMA_API_URL || "https://api.atoma.network/v1",
        model: {
            [types_ts_1.ModelClass.SMALL]: {
                name: settings_ts_1.default.SMALL_ATOMA_MODEL ||
                    "meta-llama/Llama-3.3-70B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.MEDIUM]: {
                name: settings_ts_1.default.MEDIUM_ATOMA_MODEL ||
                    "meta-llama/Llama-3.3-70B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.7,
            },
            [types_ts_1.ModelClass.LARGE]: {
                name: settings_ts_1.default.LARGE_ATOMA_MODEL ||
                    "meta-llama/Llama-3.3-70B-Instruct",
                stop: [],
                maxInputTokens: 128000,
                maxOutputTokens: 8192,
                temperature: 0.7,
            },
        },
    },
};
function getModelSettings(provider, type) {
    return exports.models[provider]?.model[type];
}
function getImageModelSettings(provider) {
    return exports.models[provider]?.model[types_ts_1.ModelClass.IMAGE];
}
function getEmbeddingModelSettings(provider) {
    return exports.models[provider]?.model[types_ts_1.ModelClass.EMBEDDING];
}
function getEndpoint(provider) {
    return exports.models[provider].endpoint;
}
