"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
exports.findNearestEnvFile = findNearestEnvFile;
exports.configureSettings = configureSettings;
exports.loadEnvConfig = loadEnvConfig;
exports.getEnvVariable = getEnvVariable;
exports.hasEnvVariable = hasEnvVariable;
const dotenv_1 = require("dotenv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_ts_1 = __importDefault(require("./logger.ts"));
logger_ts_1.default.info("Loading embedding settings:", {
    USE_OPENAI_EMBEDDING: process.env.USE_OPENAI_EMBEDDING,
    USE_OLLAMA_EMBEDDING: process.env.USE_OLLAMA_EMBEDDING,
    OLLAMA_EMBEDDING_MODEL: process.env.OLLAMA_EMBEDDING_MODEL || "mxbai-embed-large",
});
// Add this logging block
logger_ts_1.default.info("Loading character settings:", {
    CHARACTER_PATH: process.env.CHARACTER_PATH,
    ARGV: process.argv,
    CHARACTER_ARG: process.argv.find((arg) => arg.startsWith("--character=")),
    CWD: process.cwd(),
});
let environmentSettings = {};
/**
 * Determines if code is running in a browser environment
 * @returns {boolean} True if in browser environment
 */
const isBrowser = () => {
    return (typeof window !== "undefined" && typeof window.document !== "undefined");
};
/**
 * Recursively searches for a .env file starting from the current directory
 * and moving up through parent directories (Node.js only)
 * @param {string} [startDir=process.cwd()] - Starting directory for the search
 * @returns {string|null} Path to the nearest .env file or null if not found
 */
function findNearestEnvFile(startDir = process.cwd()) {
    if (isBrowser())
        return null;
    let currentDir = startDir;
    // Continue searching until we reach the root directory
    while (currentDir !== path_1.default.parse(currentDir).root) {
        const envPath = path_1.default.join(currentDir, ".env");
        if (fs_1.default.existsSync(envPath)) {
            return envPath;
        }
        // Move up to parent directory
        currentDir = path_1.default.dirname(currentDir);
    }
    // Check root directory as well
    const rootEnvPath = path_1.default.join(path_1.default.parse(currentDir).root, ".env");
    return fs_1.default.existsSync(rootEnvPath) ? rootEnvPath : null;
}
/**
 * Configures environment settings for browser usage
 * @param {Settings} settings - Object containing environment variables
 */
function configureSettings(settings) {
    environmentSettings = { ...settings };
}
/**
 * Loads environment variables from the nearest .env file in Node.js
 * or returns configured settings in browser
 * @returns {Settings} Environment variables object
 * @throws {Error} If no .env file is found in Node.js environment
 */
function loadEnvConfig() {
    // For browser environments, return the configured settings
    if (isBrowser()) {
        return environmentSettings;
    }
    // Node.js environment: load from .env file
    const envPath = findNearestEnvFile();
    // attempt to Load the .env file into process.env
    const result = (0, dotenv_1.config)(envPath ? { path: envPath } : {});
    if (!result.error) {
        logger_ts_1.default.log(`Loaded .env file from: ${envPath}`);
    }
    // Parse namespaced settings
    const namespacedSettings = parseNamespacedSettings(process.env);
    // Attach to process.env for backward compatibility
    Object.entries(namespacedSettings).forEach(([namespace, settings]) => {
        process.env[`__namespaced_${namespace}`] = JSON.stringify(settings);
    });
    return process.env;
}
/**
 * Gets a specific environment variable
 * @param {string} key - The environment variable key
 * @param {string} [defaultValue] - Optional default value if key doesn't exist
 * @returns {string|undefined} The environment variable value or default value
 */
function getEnvVariable(key, defaultValue) {
    if (isBrowser()) {
        return environmentSettings[key] || defaultValue;
    }
    return process.env[key] || defaultValue;
}
/**
 * Checks if a specific environment variable exists
 * @param {string} key - The environment variable key
 * @returns {boolean} True if the environment variable exists
 */
function hasEnvVariable(key) {
    if (isBrowser()) {
        return key in environmentSettings;
    }
    return key in process.env;
}
// Initialize settings based on environment
exports.settings = isBrowser() ? environmentSettings : loadEnvConfig();
logger_ts_1.default.info("Parsed settings:", {
    USE_OPENAI_EMBEDDING: exports.settings.USE_OPENAI_EMBEDDING,
    USE_OPENAI_EMBEDDING_TYPE: typeof exports.settings.USE_OPENAI_EMBEDDING,
    USE_OLLAMA_EMBEDDING: exports.settings.USE_OLLAMA_EMBEDDING,
    USE_OLLAMA_EMBEDDING_TYPE: typeof exports.settings.USE_OLLAMA_EMBEDDING,
    OLLAMA_EMBEDDING_MODEL: exports.settings.OLLAMA_EMBEDDING_MODEL || "mxbai-embed-large",
});
exports.default = exports.settings;
// Add this function to parse namespaced settings
function parseNamespacedSettings(env) {
    const namespaced = {};
    for (const [key, value] of Object.entries(env)) {
        if (!value)
            continue;
        const [namespace, ...rest] = key.split(".");
        if (!namespace || rest.length === 0)
            continue;
        const settingKey = rest.join(".");
        namespaced[namespace] = namespaced[namespace] || {};
        namespaced[namespace][settingKey] = value;
    }
    return namespaced;
}
