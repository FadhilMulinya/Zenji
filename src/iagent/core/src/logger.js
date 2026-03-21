"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.elizaLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const pino_pretty_1 = __importDefault(require("pino-pretty"));
const parsing_ts_1 = require("./parsing.ts");
const customLevels = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    log: 29,
    progress: 28,
    success: 27,
    debug: 20,
    trace: 10,
};
const raw = (0, parsing_ts_1.parseBooleanFromText)(process?.env?.LOG_JSON_FORMAT) || false;
const createStream = () => {
    if (raw) {
        return undefined;
    }
    return (0, pino_pretty_1.default)({
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
    });
};
const defaultLevel = process?.env?.DEFAULT_LOG_LEVEL || "info";
const options = {
    level: defaultLevel,
    customLevels,
    hooks: {
        logMethod(inputArgs, method) {
            const [arg1, ...rest] = inputArgs;
            if (typeof arg1 === "object") {
                const messageParts = rest.map((arg) => typeof arg === "string" ? arg : JSON.stringify(arg));
                const message = messageParts.join(" ");
                method.apply(this, [arg1, message]);
            }
            else {
                const context = {};
                const messageParts = [arg1, ...rest].map((arg) => typeof arg === "string" ? arg : arg);
                const message = messageParts
                    .filter((part) => typeof part === "string")
                    .join(" ");
                const jsonParts = messageParts.filter((part) => typeof part === "object");
                Object.assign(context, ...jsonParts);
                method.apply(this, [context, message]);
            }
        },
    },
};
exports.elizaLogger = (0, pino_1.default)(options, createStream());
exports.default = exports.elizaLogger;
