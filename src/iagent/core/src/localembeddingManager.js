"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const url_1 = require("url");
const fastembed_1 = require("fastembed");
const logger_1 = __importDefault(require("./logger"));
class LocalEmbeddingModelManager {
    constructor() {
        this.model = null;
        this.initPromise = null;
        this.initializationLock = false;
    }
    static getInstance() {
        if (!LocalEmbeddingModelManager.instance) {
            LocalEmbeddingModelManager.instance =
                new LocalEmbeddingModelManager();
        }
        return LocalEmbeddingModelManager.instance;
    }
    async getRootPath() {
        const __filename = (0, url_1.fileURLToPath)(import.meta.url);
        const __dirname = node_path_1.default.dirname(__filename);
        const rootPath = node_path_1.default.resolve(__dirname, "..");
        return rootPath.includes("/eliza/")
            ? rootPath.split("/eliza/")[0] + "/eliza/"
            : node_path_1.default.resolve(__dirname, "..");
    }
    async initialize() {
        // If already initialized, return immediately
        if (this.model) {
            return;
        }
        // If initialization is in progress, wait for it
        if (this.initPromise) {
            return this.initPromise;
        }
        // Use a lock to prevent multiple simultaneous initializations
        if (this.initializationLock) {
            // Wait for current initialization to complete
            while (this.initializationLock) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            return;
        }
        this.initializationLock = true;
        try {
            this.initPromise = this.initializeModel();
            await this.initPromise;
        }
        finally {
            this.initializationLock = false;
            this.initPromise = null;
        }
    }
    async initializeModel() {
        const isNode = typeof process !== "undefined" &&
            process.versions != null &&
            process.versions.node != null;
        if (!isNode) {
            throw new Error("Local embedding not supported in browser");
        }
        try {
            const fs = await Promise.resolve().then(() => __importStar(require("fs")));
            const cacheDir = (await this.getRootPath()) + "/cache/";
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            logger_1.default.debug("Initializing BGE embedding model...");
            this.model = await fastembed_1.FlagEmbedding.init({
                cacheDir: cacheDir,
                model: fastembed_1.EmbeddingModel.BGESmallENV15,
                maxLength: 512,
            });
            logger_1.default.debug("BGE model initialized successfully");
        }
        catch (error) {
            logger_1.default.error("Failed to initialize BGE model:", error);
            throw error;
        }
    }
    async generateEmbedding(input) {
        if (!this.model) {
            await this.initialize();
        }
        if (!this.model) {
            throw new Error("Failed to initialize model");
        }
        try {
            // Let fastembed handle tokenization internally
            const embedding = await this.model.queryEmbed(input);
            // Debug the raw embedding - uncomment if debugging embeddings
            // elizaLogger.debug("Raw embedding from BGE:", {
            //     type: typeof embedding,
            //     isArray: Array.isArray(embedding),
            //     dimensions: Array.isArray(embedding)
            //         ? embedding.length
            //         : "not an array",
            //     sample: Array.isArray(embedding)
            //         ? embedding.slice(0, 5)
            //         : embedding,
            // });
            return this.processEmbedding(embedding);
        }
        catch (error) {
            logger_1.default.error("Embedding generation failed:", error);
            throw error;
        }
    }
    processEmbedding(embedding) {
        let finalEmbedding;
        if (ArrayBuffer.isView(embedding) &&
            embedding.constructor === Float32Array) {
            finalEmbedding = Array.from(embedding);
        }
        else if (Array.isArray(embedding) &&
            ArrayBuffer.isView(embedding[0]) &&
            embedding[0].constructor === Float32Array) {
            finalEmbedding = Array.from(embedding[0]);
        }
        else if (Array.isArray(embedding)) {
            finalEmbedding = embedding;
        }
        else {
            throw new Error(`Unexpected embedding format: ${typeof embedding}`);
        }
        finalEmbedding = finalEmbedding.map((n) => Number(n));
        if (!Array.isArray(finalEmbedding) || finalEmbedding[0] === undefined) {
            throw new Error("Invalid embedding format: must be an array starting with a number");
        }
        if (finalEmbedding.length !== 384) {
            logger_1.default.warn(`Unexpected embedding dimension: ${finalEmbedding.length}`);
        }
        return finalEmbedding;
    }
    async reset() {
        if (this.model) {
            // Add any cleanup logic here if needed
            this.model = null;
        }
        this.initPromise = null;
        this.initializationLock = false;
    }
    // For testing purposes
    static resetInstance() {
        if (LocalEmbeddingModelManager.instance) {
            LocalEmbeddingModelManager.instance.reset();
            LocalEmbeddingModelManager.instance = null;
        }
    }
}
exports.default = LocalEmbeddingModelManager;
