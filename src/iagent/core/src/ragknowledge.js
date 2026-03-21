"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAGKnowledgeManager = void 0;
const embedding_ts_1 = require("./embedding.ts");
const generation_ts_1 = require("./generation.ts");
const logger_ts_1 = __importDefault(require("./logger.ts"));
const types_ts_1 = require("./types.ts");
const uuid_ts_1 = require("./uuid.ts");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Manage knowledge in the database.
 */
class RAGKnowledgeManager {
    /**
     * Constructs a new KnowledgeManager instance.
     * @param opts Options for the manager.
     * @param opts.tableName The name of the table this manager will operate on.
     * @param opts.runtime The AgentRuntime instance associated with this manager.
     */
    constructor(opts) {
        this.defaultRAGMatchThreshold = 0.85;
        this.defaultRAGMatchCount = 8;
        /**
         * Common English stop words to filter out from query analysis
         */
        this.stopWords = new Set([
            "a",
            "an",
            "and",
            "are",
            "as",
            "at",
            "be",
            "by",
            "does",
            "for",
            "from",
            "had",
            "has",
            "have",
            "he",
            "her",
            "his",
            "how",
            "hey",
            "i",
            "in",
            "is",
            "it",
            "its",
            "of",
            "on",
            "or",
            "that",
            "the",
            "this",
            "to",
            "was",
            "what",
            "when",
            "where",
            "which",
            "who",
            "will",
            "with",
            "would",
            "there",
            "their",
            "they",
            "your",
            "you",
        ]);
        this.runtime = opts.runtime;
        this.tableName = opts.tableName;
        this.knowledgeRoot = opts.knowledgeRoot;
    }
    /**
     * Filters out stop words and returns meaningful terms
     */
    getQueryTerms(query) {
        return query
            .toLowerCase()
            .split(" ")
            .filter((term) => term.length > 2) // Filter very short words
            .filter((term) => !this.stopWords.has(term)); // Filter stop words
    }
    /**
     * Preprocesses text content for better RAG performance.
     * @param content The text content to preprocess.
     * @returns The preprocessed text.
     */
    preprocess(content) {
        if (!content || typeof content !== "string") {
            logger_ts_1.default.warn("Invalid input for preprocessing");
            return "";
        }
        return (content
            .replace(/```[\s\S]*?```/g, "")
            .replace(/`.*?`/g, "")
            .replace(/#{1,6}\s*(.*)/g, "$1")
            .replace(/!\[(.*?)\]\(.*?\)/g, "$1")
            .replace(/\[(.*?)\]\(.*?\)/g, "$1")
            .replace(/(https?:\/\/)?(www\.)?([^\s]+\.[^\s]+)/g, "$3")
            .replace(/<@[!&]?\d+>/g, "")
            .replace(/<[^>]*>/g, "")
            .replace(/^\s*[-*_]{3,}\s*$/gm, "")
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/\/\/.*/g, "")
            .replace(/\s+/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            // .replace(/[^a-zA-Z0-9\s\-_./:?=&]/g, "") --this strips out CJK characters
            .trim()
            .toLowerCase());
    }
    hasProximityMatch(text, terms) {
        if (!text || !terms.length) {
            return false;
        }
        const words = text.toLowerCase().split(" ").filter(w => w.length > 0);
        // Find all positions for each term (not just first occurrence)
        const allPositions = terms.flatMap(term => words.reduce((positions, word, idx) => {
            if (word.includes(term))
                positions.push(idx);
            return positions;
        }, [])).sort((a, b) => a - b);
        if (allPositions.length < 2)
            return false;
        // Check proximity
        for (let i = 0; i < allPositions.length - 1; i++) {
            if (Math.abs(allPositions[i] - allPositions[i + 1]) <= 5) {
                logger_ts_1.default.debug("[Proximity Match]", {
                    terms,
                    positions: allPositions,
                    matchFound: `${allPositions[i]} - ${allPositions[i + 1]}`
                });
                return true;
            }
        }
        return false;
    }
    async getKnowledge(params) {
        const agentId = params.agentId || this.runtime.agentId;
        // If id is provided, do direct lookup first
        if (params.id) {
            const directResults = await this.runtime.databaseAdapter.getKnowledge({
                id: params.id,
                agentId: agentId,
            });
            if (directResults.length > 0) {
                return directResults;
            }
        }
        // If no id or no direct results, perform semantic search
        if (params.query) {
            try {
                const processedQuery = this.preprocess(params.query);
                // Build search text with optional context
                let searchText = processedQuery;
                if (params.conversationContext) {
                    const relevantContext = this.preprocess(params.conversationContext);
                    searchText = `${relevantContext} ${processedQuery}`;
                }
                const embeddingArray = await (0, embedding_ts_1.embed)(this.runtime, searchText);
                const embedding = new Float32Array(embeddingArray);
                // Get results with single query
                const results = await this.runtime.databaseAdapter.searchKnowledge({
                    agentId: this.runtime.agentId,
                    embedding: embedding,
                    match_threshold: this.defaultRAGMatchThreshold,
                    match_count: (params.limit || this.defaultRAGMatchCount) * 2,
                    searchText: processedQuery,
                });
                // Enhanced reranking with sophisticated scoring
                const rerankedResults = results
                    .map((result) => {
                    let score = result.similarity;
                    // Check for direct query term matches
                    const queryTerms = this.getQueryTerms(processedQuery);
                    const matchingTerms = queryTerms.filter((term) => result.content.text.toLowerCase().includes(term));
                    if (matchingTerms.length > 0) {
                        // Much stronger boost for matches
                        score *=
                            1 +
                                (matchingTerms.length / queryTerms.length) * 2; // Double the boost
                        if (this.hasProximityMatch(result.content.text, matchingTerms)) {
                            score *= 1.5; // Stronger proximity boost
                        }
                    }
                    else {
                        // More aggressive penalty
                        if (!params.conversationContext) {
                            score *= 0.3; // Stronger penalty
                        }
                    }
                    return {
                        ...result,
                        score,
                        matchedTerms: matchingTerms, // Add for debugging
                    };
                })
                    .sort((a, b) => b.score - a.score);
                // Filter and return results
                return rerankedResults
                    .filter((result) => result.score >= this.defaultRAGMatchThreshold)
                    .slice(0, params.limit || this.defaultRAGMatchCount);
            }
            catch (error) {
                console.log(`[RAG Search Error] ${error}`);
                return [];
            }
        }
        // If neither id nor query provided, return empty array
        return [];
    }
    async createKnowledge(item) {
        if (!item.content.text) {
            logger_ts_1.default.warn("Empty content in knowledge item");
            return;
        }
        try {
            // Process main document
            const processedContent = this.preprocess(item.content.text);
            const mainEmbeddingArray = await (0, embedding_ts_1.embed)(this.runtime, processedContent);
            const mainEmbedding = new Float32Array(mainEmbeddingArray);
            // Create main document
            await this.runtime.databaseAdapter.createKnowledge({
                id: item.id,
                agentId: this.runtime.agentId,
                content: {
                    text: item.content.text,
                    metadata: {
                        ...item.content.metadata,
                        isMain: true,
                    },
                },
                embedding: mainEmbedding,
                createdAt: Date.now(),
            });
            // Generate and store chunks
            const chunks = await (0, generation_ts_1.splitChunks)(processedContent, 512, 20);
            for (const [index, chunk] of chunks.entries()) {
                const chunkEmbeddingArray = await (0, embedding_ts_1.embed)(this.runtime, chunk);
                const chunkEmbedding = new Float32Array(chunkEmbeddingArray);
                const chunkId = `${item.id}-chunk-${index}`;
                await this.runtime.databaseAdapter.createKnowledge({
                    id: chunkId,
                    agentId: this.runtime.agentId,
                    content: {
                        text: chunk,
                        metadata: {
                            ...item.content.metadata,
                            isChunk: true,
                            originalId: item.id,
                            chunkIndex: index,
                        },
                    },
                    embedding: chunkEmbedding,
                    createdAt: Date.now(),
                });
            }
        }
        catch (error) {
            logger_ts_1.default.error(`Error processing knowledge ${item.id}:`, error);
            throw error;
        }
    }
    async searchKnowledge(params) {
        const { match_threshold = this.defaultRAGMatchThreshold, match_count = this.defaultRAGMatchCount, embedding, searchText, } = params;
        const float32Embedding = Array.isArray(embedding)
            ? new Float32Array(embedding)
            : embedding;
        return await this.runtime.databaseAdapter.searchKnowledge({
            agentId: params.agentId || this.runtime.agentId,
            embedding: float32Embedding,
            match_threshold,
            match_count,
            searchText,
        });
    }
    async removeKnowledge(id) {
        await this.runtime.databaseAdapter.removeKnowledge(id);
    }
    async clearKnowledge(shared) {
        await this.runtime.databaseAdapter.clearKnowledge(this.runtime.agentId, shared ? shared : false);
    }
    /**
     * Lists all knowledge entries for an agent without semantic search or reranking.
     * Used primarily for administrative tasks like cleanup.
     *
     * @param agentId The agent ID to fetch knowledge entries for
     * @returns Array of RAGKnowledgeItem entries
     */
    async listAllKnowledge(agentId) {
        logger_ts_1.default.debug(`[Knowledge List] Fetching all entries for agent: ${agentId}`);
        try {
            // Only pass the required agentId parameter
            const results = await this.runtime.databaseAdapter.getKnowledge({
                agentId: agentId,
            });
            logger_ts_1.default.debug(`[Knowledge List] Found ${results.length} entries`);
            return results;
        }
        catch (error) {
            logger_ts_1.default.error("[Knowledge List] Error fetching knowledge entries:", error);
            throw error;
        }
    }
    async cleanupDeletedKnowledgeFiles() {
        try {
            logger_ts_1.default.debug("[Cleanup] Starting knowledge cleanup process, agent: ", this.runtime.agentId);
            logger_ts_1.default.debug(`[Cleanup] Knowledge root path: ${this.knowledgeRoot}`);
            const existingKnowledge = await this.listAllKnowledge(this.runtime.agentId);
            // Only process parent documents, ignore chunks
            const parentDocuments = existingKnowledge.filter((item) => !item.id.includes("chunk") && item.content.metadata?.source // Must have a source path
            );
            logger_ts_1.default.debug(`[Cleanup] Found ${parentDocuments.length} parent documents to check`);
            for (const item of parentDocuments) {
                const relativePath = item.content.metadata?.source;
                const filePath = (0, path_1.join)(this.knowledgeRoot, relativePath);
                logger_ts_1.default.debug(`[Cleanup] Checking joined file path: ${filePath}`);
                if (!(0, fs_1.existsSync)(filePath)) {
                    logger_ts_1.default.warn(`[Cleanup] File not found, starting removal process: ${filePath}`);
                    const idToRemove = item.id;
                    logger_ts_1.default.debug(`[Cleanup] Using ID for removal: ${idToRemove}`);
                    try {
                        // Just remove the parent document - this will cascade to chunks
                        await this.removeKnowledge(idToRemove);
                        // // Clean up the cache
                        // const baseCacheKeyWithWildcard = `${this.generateKnowledgeCacheKeyBase(
                        //     idToRemove,
                        //     item.content.metadata?.isShared || false
                        // )}*`;
                        // await this.cacheManager.deleteByPattern({
                        //     keyPattern: baseCacheKeyWithWildcard,
                        // });
                        logger_ts_1.default.success(`[Cleanup] Successfully removed knowledge for file: ${filePath}`);
                    }
                    catch (deleteError) {
                        logger_ts_1.default.error(`[Cleanup] Error during deletion process for ${filePath}:`, deleteError instanceof Error
                            ? {
                                message: deleteError.message,
                                stack: deleteError.stack,
                                name: deleteError.name,
                            }
                            : deleteError);
                    }
                }
            }
            logger_ts_1.default.debug("[Cleanup] Finished knowledge cleanup process");
        }
        catch (error) {
            logger_ts_1.default.error("[Cleanup] Error cleaning up deleted knowledge files:", error);
        }
    }
    generateScopedId(path, isShared) {
        // Prefix the path with scope before generating UUID to ensure different IDs for shared vs private
        const scope = isShared ? types_ts_1.KnowledgeScope.SHARED : types_ts_1.KnowledgeScope.PRIVATE;
        const scopedPath = `${scope}-${path}`;
        return (0, uuid_ts_1.stringToUuid)(scopedPath);
    }
    async processFile(file) {
        const timeMarker = (label) => {
            const time = (Date.now() - startTime) / 1000;
            logger_ts_1.default.info(`[Timing] ${label}: ${time.toFixed(2)}s`);
        };
        const startTime = Date.now();
        const content = file.content;
        try {
            const fileSizeKB = new TextEncoder().encode(content).length / 1024;
            logger_ts_1.default.info(`[File Progress] Starting ${file.path} (${fileSizeKB.toFixed(2)} KB)`);
            // Generate scoped ID for the file
            const scopedId = this.generateScopedId(file.path, file.isShared || false);
            // Step 1: Preprocessing
            //const preprocessStart = Date.now();
            const processedContent = this.preprocess(content);
            timeMarker("Preprocessing");
            // Step 2: Main document embedding
            const mainEmbeddingArray = await (0, embedding_ts_1.embed)(this.runtime, processedContent);
            const mainEmbedding = new Float32Array(mainEmbeddingArray);
            timeMarker("Main embedding");
            // Step 3: Create main document
            await this.runtime.databaseAdapter.createKnowledge({
                id: scopedId,
                agentId: this.runtime.agentId,
                content: {
                    text: content,
                    metadata: {
                        source: file.path,
                        type: file.type,
                        isShared: file.isShared || false,
                    },
                },
                embedding: mainEmbedding,
                createdAt: Date.now(),
            });
            timeMarker("Main document storage");
            // Step 4: Generate chunks
            const chunks = await (0, generation_ts_1.splitChunks)(processedContent, 512, 20);
            const totalChunks = chunks.length;
            logger_ts_1.default.info(`Generated ${totalChunks} chunks`);
            timeMarker("Chunk generation");
            // Step 5: Process chunks with larger batches
            const BATCH_SIZE = 10; // Increased batch size
            let processedChunks = 0;
            for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
                const batchStart = Date.now();
                const batch = chunks.slice(i, Math.min(i + BATCH_SIZE, chunks.length));
                // Process embeddings in parallel
                const embeddings = await Promise.all(batch.map((chunk) => (0, embedding_ts_1.embed)(this.runtime, chunk)));
                // Batch database operations
                await Promise.all(embeddings.map(async (embeddingArray, index) => {
                    const chunkId = `${scopedId}-chunk-${i + index}`;
                    const chunkEmbedding = new Float32Array(embeddingArray);
                    await this.runtime.databaseAdapter.createKnowledge({
                        id: chunkId,
                        agentId: this.runtime.agentId,
                        content: {
                            text: batch[index],
                            metadata: {
                                source: file.path,
                                type: file.type,
                                isShared: file.isShared || false,
                                isChunk: true,
                                originalId: scopedId,
                                chunkIndex: i + index,
                                originalPath: file.path,
                            },
                        },
                        embedding: chunkEmbedding,
                        createdAt: Date.now(),
                    });
                }));
                processedChunks += batch.length;
                const batchTime = (Date.now() - batchStart) / 1000;
                logger_ts_1.default.info(`[Batch Progress] ${file.path}: Processed ${processedChunks}/${totalChunks} chunks (${batchTime.toFixed(2)}s for batch)`);
            }
            const totalTime = (Date.now() - startTime) / 1000;
            logger_ts_1.default.info(`[Complete] Processed ${file.path} in ${totalTime.toFixed(2)}s`);
        }
        catch (error) {
            if (file.isShared &&
                error?.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
                logger_ts_1.default.info(`Shared knowledge ${file.path} already exists in database, skipping creation`);
                return;
            }
            logger_ts_1.default.error(`Error processing file ${file.path}:`, error);
            throw error;
        }
    }
}
exports.RAGKnowledgeManager = RAGKnowledgeManager;
