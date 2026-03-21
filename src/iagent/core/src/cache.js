"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheManager = exports.DbCacheAdapter = exports.FsCacheAdapter = exports.MemoryCacheAdapter = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class MemoryCacheAdapter {
    constructor(initalData) {
        this.data = initalData ?? new Map();
    }
    async get(key) {
        return this.data.get(key);
    }
    async set(key, value) {
        this.data.set(key, value);
    }
    async delete(key) {
        this.data.delete(key);
    }
}
exports.MemoryCacheAdapter = MemoryCacheAdapter;
class FsCacheAdapter {
    constructor(dataDir) {
        this.dataDir = dataDir;
    }
    async get(key) {
        try {
            return await promises_1.default.readFile(path_1.default.join(this.dataDir, key), "utf8");
        }
        catch {
            // console.error(error);
            return undefined;
        }
    }
    async set(key, value) {
        try {
            const filePath = path_1.default.join(this.dataDir, key);
            // Ensure the directory exists
            await promises_1.default.mkdir(path_1.default.dirname(filePath), { recursive: true });
            await promises_1.default.writeFile(filePath, value, "utf8");
        }
        catch (error) {
            console.error(error);
        }
    }
    async delete(key) {
        try {
            const filePath = path_1.default.join(this.dataDir, key);
            await promises_1.default.unlink(filePath);
        }
        catch {
            // console.error(error);
        }
    }
}
exports.FsCacheAdapter = FsCacheAdapter;
class DbCacheAdapter {
    constructor(db, agentId) {
        this.db = db;
        this.agentId = agentId;
    }
    async get(key) {
        return this.db.getCache({ agentId: this.agentId, key });
    }
    async set(key, value) {
        await this.db.setCache({ agentId: this.agentId, key, value });
    }
    async delete(key) {
        await this.db.deleteCache({ agentId: this.agentId, key });
    }
}
exports.DbCacheAdapter = DbCacheAdapter;
class CacheManager {
    constructor(adapter) {
        this.adapter = adapter;
    }
    async get(key) {
        const data = await this.adapter.get(key);
        if (data) {
            const { value, expires } = JSON.parse(data);
            if (!expires || expires > Date.now()) {
                return value;
            }
            this.adapter.delete(key).catch(() => { });
        }
        return undefined;
    }
    async set(key, value, opts) {
        return this.adapter.set(key, JSON.stringify({ value, expires: opts?.expires ?? 0 }));
    }
    async delete(key) {
        return this.adapter.delete(key);
    }
}
exports.CacheManager = CacheManager;
