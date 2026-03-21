"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocess = preprocess;
const embedding_ts_1 = require("./embedding.ts");
const uuid_ts_1 = require("./uuid.ts");
const generation_ts_1 = require("./generation.ts");
const logger_ts_1 = __importDefault(require("./logger.ts"));
async function get(runtime, message) {
    // Add validation for message
    if (!message?.content?.text) {
        logger_ts_1.default.warn("Invalid message for knowledge query:", {
            message,
            content: message?.content,
            text: message?.content?.text,
        });
        return [];
    }
    const processed = preprocess(message.content.text);
    logger_ts_1.default.debug("Knowledge query:", {
        original: message.content.text,
        processed,
        length: processed?.length,
    });
    // Validate processed text
    if (!processed || processed.trim().length === 0) {
        logger_ts_1.default.warn("Empty processed text for knowledge query");
        return [];
    }
    const embedding = await (0, embedding_ts_1.embed)(runtime, processed);
    const fragments = await runtime.knowledgeManager.searchMemoriesByEmbedding(embedding, {
        roomId: message.agentId,
        count: 5,
        match_threshold: 0.1,
    });
    const uniqueSources = [
        ...new Set(fragments.map((memory) => {
            logger_ts_1.default.log(`Matched fragment: ${memory.content.text} with similarity: ${memory.similarity}`);
            return memory.content.source;
        })),
    ];
    const knowledgeDocuments = await Promise.all(uniqueSources.map((source) => runtime.documentsManager.getMemoryById(source)));
    return knowledgeDocuments
        .filter((memory) => memory !== null)
        .map((memory) => ({ id: memory.id, content: memory.content }));
}
async function set(runtime, item, chunkSize = 512, bleed = 20) {
    await runtime.documentsManager.createMemory({
        id: item.id,
        agentId: runtime.agentId,
        roomId: runtime.agentId,
        userId: runtime.agentId,
        createdAt: Date.now(),
        content: item.content,
        embedding: (0, embedding_ts_1.getEmbeddingZeroVector)(),
    });
    const preprocessed = preprocess(item.content.text);
    const fragments = await (0, generation_ts_1.splitChunks)(preprocessed, chunkSize, bleed);
    for (const fragment of fragments) {
        const embedding = await (0, embedding_ts_1.embed)(runtime, fragment);
        await runtime.knowledgeManager.createMemory({
            // We namespace the knowledge base uuid to avoid id
            // collision with the document above.
            id: (0, uuid_ts_1.stringToUuid)(item.id + fragment),
            roomId: runtime.agentId,
            agentId: runtime.agentId,
            userId: runtime.agentId,
            createdAt: Date.now(),
            content: {
                source: item.id,
                text: fragment,
            },
            embedding,
        });
    }
}
function preprocess(content) {
    logger_ts_1.default.debug("Preprocessing text:", {
        input: content,
        length: content?.length,
    });
    if (!content || typeof content !== "string") {
        logger_ts_1.default.warn("Invalid input for preprocessing");
        return "";
    }
    return (content
        // Remove code blocks and their content
        .replace(/```[\s\S]*?```/g, "")
        // Remove inline code
        .replace(/`.*?`/g, "")
        // Convert headers to plain text with emphasis
        .replace(/#{1,6}\s*(.*)/g, "$1")
        // Remove image links but keep alt text
        .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
        // Remove links but keep text
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        // Simplify URLs: remove protocol and simplify to domain+path
        .replace(/(https?:\/\/)?(www\.)?([^\s]+\.[^\s]+)/g, "$3")
        // Remove Discord mentions specifically
        .replace(/<@[!&]?\d+>/g, "")
        // Remove HTML tags
        .replace(/<[^>]*>/g, "")
        // Remove horizontal rules
        .replace(/^\s*[-*_]{3,}\s*$/gm, "")
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*/g, "")
        // Normalize whitespace
        .replace(/\s+/g, " ")
        // Remove multiple newlines
        .replace(/\n{3,}/g, "\n\n")
        // Remove special characters except those common in URLs
        .replace(/[^a-zA-Z0-9\s\-_./:?=&]/g, "")
        .trim()
        .toLowerCase());
}
exports.default = {
    get,
    set,
    preprocess,
};
