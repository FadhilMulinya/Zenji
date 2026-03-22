import "dotenv/config";

export const ENV = {
  SERVER_PORT: process.env.SERVER_PORT || 8001,
  MONGO_URI: process.env.MONGO_URI as string,
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  INJECTIVE_RPC_URL: process.env.INJECTIVE_RPC_URL as string,
  NODE_ENV: process.env.NODE_ENV as string,
  FRONTEND_URLS: process.env.FRONTEND_URLS as string,
  OPENAI_API_KEY:process.env.OPENAI_API_KEY as string,
  OLLAMA_API_URL:process.env.OLLAMA_API_URL as string,
  // API Docs
  API_DOCS_USER: process.env.API_DOCS_USER || "admin",
  API_DOCS_PASSWORD: process.env.API_DOCS_PASSWORD || "admin",
  API_DOCS_SERVER: process.env.API_DOCS_SERVER || "http://localhost:8001",
  API_DOCS_REALM: process.env.API_DOCS_REALM || "your_api_docs",
  // JWT related
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,

  // Admin
  ADMIN_INITIAL_PASS: process.env.ADMIN_INITIAL_PASS as string,
  ADMIN_INITIAL_EMAIL: process.env.ADMIN_INITIAL_EMAIL as string,
  RESEND_KEY: process.env.RESEND_KEY as string,
};

// ── Inject Ollama settings into process.env for iagent core ──
// The iagent core reads these directly from process.env, not from our ENV object.
process.env.USE_OLLAMA_EMBEDDING = "true";
process.env.OLLAMA_SERVER_URL = ENV.OLLAMA_API_URL?.replace("/api", "") || "http://localhost:11434";
process.env.OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "nomic-embed-text";
process.env.OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";
process.env.SMALL_OLLAMA_MODEL = process.env.SMALL_OLLAMA_MODEL || "llama3.2:3b";
process.env.MEDIUM_OLLAMA_MODEL = process.env.MEDIUM_OLLAMA_MODEL || "llama3.2:3b";
process.env.LARGE_OLLAMA_MODEL = process.env.LARGE_OLLAMA_MODEL || "llama3.2:3b";

export const isProduction = process.env.NODE_ENV === "production";

const REQUIRED_ENV = [
  "MONGO_URI",
  "BOT_TOKEN",
  "NODE_ENV",
  "FRONTEND_URLS",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
];

// Check that all required env variables are set
for (const key of REQUIRED_ENV) {
  if (ENV[key as keyof typeof ENV] === undefined) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const AllowedOrigins = ENV.FRONTEND_URLS ? ENV.FRONTEND_URLS.split(",") : [];


