"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterSchema = exports.envSchema = void 0;
exports.validateEnv = validateEnv;
exports.validateCharacterConfig = validateCharacterConfig;
const zod_1 = require("zod");
const types_1 = require("./types");
const logger_1 = __importDefault(require("./logger"));
// TODO: TO COMPLETE
exports.envSchema = zod_1.z.object({
    // API Keys with specific formats
    OPENAI_API_KEY: zod_1.z
        .string()
        .startsWith("sk-", "OpenAI API key must start with 'sk-'"),
    REDPILL_API_KEY: zod_1.z.string().min(1, "REDPILL API key is required"),
    GROK_API_KEY: zod_1.z.string().min(1, "GROK API key is required"),
    GROQ_API_KEY: zod_1.z
        .string()
        .startsWith("gsk_", "GROQ API key must start with 'gsk_'"),
    OPENROUTER_API_KEY: zod_1.z.string().min(1, "OpenRouter API key is required"),
    GOOGLE_GENERATIVE_AI_API_KEY: zod_1.z
        .string()
        .min(1, "Gemini API key is required"),
    ELEVENLABS_XI_API_KEY: zod_1.z.string().min(1, "ElevenLabs API key is required"),
});
// Validation function
function validateEnv() {
    try {
        return exports.envSchema.parse(process.env);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path}: ${err.message}`)
                .join("\n");
            throw new Error(`Environment validation failed:\n${errorMessages}`);
        }
        throw error;
    }
}
// Helper schemas for nested types
const MessageExampleSchema = zod_1.z.object({
    user: zod_1.z.string(),
    content: zod_1.z
        .object({
        text: zod_1.z.string(),
        action: zod_1.z.string().optional(),
        source: zod_1.z.string().optional(),
        url: zod_1.z.string().optional(),
        inReplyTo: zod_1.z.string().uuid().optional(),
        attachments: zod_1.z.array(zod_1.z.any()).optional(),
    })
        .and(zod_1.z.record(zod_1.z.string(), zod_1.z.unknown())), // For additional properties
});
const PluginSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    actions: zod_1.z.array(zod_1.z.any()).optional(),
    providers: zod_1.z.array(zod_1.z.any()).optional(),
    evaluators: zod_1.z.array(zod_1.z.any()).optional(),
    services: zod_1.z.array(zod_1.z.any()).optional(),
    clients: zod_1.z.array(zod_1.z.any()).optional(),
});
// Main Character schema
exports.CharacterSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().optional(),
    name: zod_1.z.string(),
    system: zod_1.z.string().optional(),
    modelProvider: zod_1.z.nativeEnum(types_1.ModelProviderName),
    modelEndpointOverride: zod_1.z.string().optional(),
    templates: zod_1.z.record(zod_1.z.string()).optional(),
    bio: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
    lore: zod_1.z.array(zod_1.z.string()),
    messageExamples: zod_1.z.array(zod_1.z.array(MessageExampleSchema)),
    postExamples: zod_1.z.array(zod_1.z.string()),
    topics: zod_1.z.array(zod_1.z.string()),
    adjectives: zod_1.z.array(zod_1.z.string()),
    knowledge: zod_1.z
        .array(zod_1.z.union([
        zod_1.z.string(), // Direct knowledge strings
        zod_1.z.object({
            // Individual file config
            path: zod_1.z.string(),
            shared: zod_1.z.boolean().optional(),
        }),
        zod_1.z.object({
            // Directory config
            directory: zod_1.z.string(),
            shared: zod_1.z.boolean().optional(),
        }),
    ]))
        .optional(),
    clients: zod_1.z.array(zod_1.z.nativeEnum(types_1.Clients)),
    plugins: zod_1.z.union([zod_1.z.array(zod_1.z.string()), zod_1.z.array(PluginSchema)]),
    settings: zod_1.z
        .object({
        secrets: zod_1.z.record(zod_1.z.string()).optional(),
        voice: zod_1.z
            .object({
            model: zod_1.z.string().optional(),
            url: zod_1.z.string().optional(),
        })
            .optional(),
        model: zod_1.z.string().optional(),
        modelConfig: zod_1.z.object({
            maxInputTokens: zod_1.z.number().optional(),
            maxOutputTokens: zod_1.z.number().optional(),
            temperature: zod_1.z.number().optional(),
            frequency_penalty: zod_1.z.number().optional(),
            presence_penalty: zod_1.z.number().optional()
        })
            .optional(),
        embeddingModel: zod_1.z.string().optional(),
    })
        .optional(),
    clientConfig: zod_1.z
        .object({
        discord: zod_1.z
            .object({
            shouldIgnoreBotMessages: zod_1.z.boolean().optional(),
            shouldIgnoreDirectMessages: zod_1.z.boolean().optional(),
        })
            .optional(),
        telegram: zod_1.z
            .object({
            shouldIgnoreBotMessages: zod_1.z.boolean().optional(),
            shouldIgnoreDirectMessages: zod_1.z.boolean().optional(),
        })
            .optional(),
    })
        .optional(),
    style: zod_1.z.object({
        all: zod_1.z.array(zod_1.z.string()),
        chat: zod_1.z.array(zod_1.z.string()),
        post: zod_1.z.array(zod_1.z.string()),
    }),
    twitterProfile: zod_1.z
        .object({
        username: zod_1.z.string(),
        screenName: zod_1.z.string(),
        bio: zod_1.z.string(),
        nicknames: zod_1.z.array(zod_1.z.string()).optional(),
    })
        .optional(),
    nft: zod_1.z
        .object({
        prompt: zod_1.z.string().optional(),
    })
        .optional(),
    extends: zod_1.z.array(zod_1.z.string()).optional(),
});
// Validation function
function validateCharacterConfig(json) {
    try {
        return exports.CharacterSchema.parse(json);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            const groupedErrors = error.errors.reduce((acc, err) => {
                const path = err.path.join(".");
                if (!acc[path]) {
                    acc[path] = [];
                }
                acc[path].push(err.message);
                return acc;
            }, {});
            Object.entries(groupedErrors).forEach(([field, messages]) => {
                logger_1.default.error(`Validation errors in ${field}: ${messages.join(" - ")}`);
            });
            throw new Error("Character configuration validation failed. Check logs for details.");
        }
        throw error;
    }
}
