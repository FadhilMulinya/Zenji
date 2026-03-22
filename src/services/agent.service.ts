import { 
    AgentRuntime,
    Character, 
    ModelProviderName, 
    UUID, 
    Memory, 
    IAgentRuntime,
    CacheManager, 
    MemoryCacheAdapter,
    stringToUuid
} from "@elizaos/core";
import { generateText as aiSdkGenerateText } from "ai";
import { createOllama } from "ollama-ai-provider";
import { injectivePlugin } from "@elizaos/plugin-injective";
import { v4 as uuidv4 } from "uuid";
import { MongoDBAdapter } from "../lib/mongo-adapter.ts";
import { zenjiCharacter } from "../characters/zenji.character.ts";
import Wallet from "../models/Wallet.ts";
import Agent from "../models/Agent.ts";
import { ENV } from "../lib/environments.ts";
import { Logger } from "borgen";
import { decryptPrivateKey } from "./crypto.service.ts";
import { createWalletForAgent } from "./wallet.service.ts";
import { InjectiveService } from "./injective.service.ts";

// ── Character generation helpers ──

function buildFullCharacter(name: string, persona: string, aiTraits: any): Character {
    return {
        name,
        username: name.toLowerCase().replace(/\s+/g, "_"),
        system: persona || zenjiCharacter.system,
        modelProvider: ModelProviderName.OLLAMA,
        bio: aiTraits?.bio || [`${name} is an AI trading agent on Injective.`, persona],
        lore: aiTraits?.lore || [`Created with persona: ${persona}`],
        messageExamples: zenjiCharacter.messageExamples || [],
        postExamples: zenjiCharacter.postExamples || [],
        topics: aiTraits?.topics || zenjiCharacter.topics,
        adjectives: aiTraits?.adjectives || zenjiCharacter.adjectives,
        style: aiTraits?.style || zenjiCharacter.style,
        plugins: [injectivePlugin],
        clients: [],
        settings: {
            secrets: {},
            voice: zenjiCharacter.settings?.voice,
        },
    };
}

async function generateCharacterTraits(name: string, persona: string): Promise<any | null> {
    try {
        const ollama = createOllama({ baseURL: ENV.OLLAMA_API_URL || "http://localhost:11434/api" });
        const { text: rawText } = await aiSdkGenerateText({
            model: ollama("llama3.2:3b"),
            prompt: `You are a JSON generator. Generate a character profile for an AI trading agent.

Agent Name: "${name}"
Persona: "${persona}"

Return ONLY this JSON structure with NO other text, NO markdown, NO explanation:
{"bio":["short bio line 1","short bio line 2"],"lore":["backstory detail 1","backstory detail 2"],"style":{"all":["style rule 1"],"chat":["chat style 1"],"post":["post style 1"]},"adjectives":["adj1","adj2","adj3"],"topics":["topic1","topic2","topic3"]}

Fill in the values based on the persona. Return ONLY the JSON.`
        });

        let jsonStr = rawText.trim();
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }
        const parsed = JSON.parse(jsonStr);

        if (parsed.bio && parsed.adjectives && parsed.topics) {
            Logger.info({ message: `Successfully generated character traits for ${name}` });
            return parsed;
        }
        throw new Error("Parsed JSON missing required fields");
    } catch (err) {
        Logger.warn({ message: `AI character generation failed (${err}), using defaults.` });
        return null;
    }
}

// ── Agent Service ──

class AgentService {
    private runtimes: Map<string, IAgentRuntime> = new Map();
    private adapter: MongoDBAdapter;
    private cache: CacheManager;

    constructor() {
        this.adapter = new MongoDBAdapter();
        this.cache = new CacheManager(new MemoryCacheAdapter());
    }

    // ── Query helpers ──

    public async getAgentsForUser(userId: string) {
        return Agent.find({ user_id: userId });
    }

    public async getActiveAgent(userId: string) {
        return Agent.findOne({ user_id: userId, status: "active" });
    }

    public async selectAgent(userId: string, agentMongoId: string) {
        // Deactivate all agents for this user
        await Agent.updateMany({ user_id: userId }, { status: "inactive" });
        // Activate the selected one
        const agent = await Agent.findByIdAndUpdate(agentMongoId, { status: "active" }, { new: true });
        // Evict old runtime caches
        if (agent) {
            const oldId = (agent.agent_id as UUID).toString();
            this.runtimes.delete(oldId);
        }
        return agent;
    }

    // ── Runtime ──

    public async getActiveRuntime(userId: string): Promise<IAgentRuntime | null> {
        const agentDoc = await Agent.findOne({ user_id: userId, status: "active" });
        if (!agentDoc) return null;

        const agentIdStr = (agentDoc.agent_id as UUID).toString();

        if (this.runtimes.has(agentIdStr)) {
            return this.runtimes.get(agentIdStr)!;
        }

        // Wallet now belongs to AGENT, not user
        const agentWallet = await Wallet.findOne({ agent_id: agentDoc._id });
        if (!agentWallet) {
            throw new Error("Agent has no wallet. This shouldn't happen — wallets are auto-created.");
        }

        const privateKey = decryptPrivateKey(agentWallet.encrypted_private_key);

        // Load the full character from DB, inject wallet secrets
        const storedCharacter = agentDoc.character_config || {};
        const character: Character = {
            ...storedCharacter,
            id: agentDoc.agent_id as UUID,
            settings: {
                ...(storedCharacter.settings || {}),
                secrets: {
                    ...(storedCharacter.settings?.secrets || {}),
                    "INJECTIVE_NETWORK": agentWallet.network || "Testnet",
                    "INJECTIVE_PRIVATE_KEY": privateKey,
                    "EVM_PUBLIC_KEY": agentWallet.ethereum_address,
                    "INJECTIVE_PUBLIC_KEY": agentWallet.public_key_hex,
                }
            }
        };

        const runtime = new AgentRuntime({
            agentId: agentDoc.agent_id as UUID,
            databaseAdapter: this.adapter,
            cacheManager: this.cache,
            token: "",
            modelProvider: ModelProviderName.OLLAMA,
            character,
            plugins: [injectivePlugin],
        });

        await runtime.initialize();
        this.runtimes.set(agentIdStr, runtime);

        return runtime;
    }

    // ── Agent creation ──

    public async createNewAgent(userId: string, name: string, persona: string): Promise<any> {
        // Deactivate all other agents for this user
        await Agent.updateMany({ user_id: userId }, { status: "inactive" });

        // 1. Generate AI traits (may fall back to defaults)
        const aiTraits = await generateCharacterTraits(name, persona);

        // 2. Build the FULL Eliza Character JSON
        const fullCharacter = buildFullCharacter(name, persona, aiTraits);

        // 3. Store agent + full character in DB
        const agentDoc = await Agent.create({
            user_id: userId,
            name,
            persona,
            character_name: name,
            status: "active",
            agent_id: stringToUuid(uuidv4()),
            room_id: stringToUuid(uuidv4()),
            character_config: fullCharacter,
        });

        // 4. Auto-create wallet for this agent
        const wallet = await createWalletForAgent(agentDoc._id as any);

        Logger.info({ message: `Created agent "${name}" with wallet ${wallet.injective_address}` });

        return { agent: agentDoc, wallet };
    }

    // ── NLP Message handling ──
    // NOTE: We bypass Eliza's generateMessageResponse() because it has a
    // ── Wallet context for grounding the LLM with real data ──

    private async fetchWalletContext(agentDocId: any): Promise<string | null> {
        try {
            const wallet = await Wallet.findOne({ agent_id: agentDocId });
            if (!wallet) return null;

            const { getBalances } = await import("./bank.service.ts");
            const balances = await getBalances(wallet.injective_address);

            if (!balances || balances.length === 0) {
                return `Wallet: ${wallet.injective_address}\nNo balances found on-chain.`;
            }

            const DENOM_DECIMALS: Record<string, number> = {
                inj: 18,
                "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5": 6, // USDT Testnet Peggy
                "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7": 6, // USDT Mainnet Peggy
            };
            const DENOM_LABELS: Record<string, string> = {
                inj: "INJ",
                "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5": "USDT",
                "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7": "USDT",
            };

            const formatted = balances.map((bal: any) => {
                const decimals = DENOM_DECIMALS[bal.denom] ?? 18;
                const amount = (parseFloat(bal.amount) / Math.pow(10, decimals)).toFixed(4);
                const label = DENOM_LABELS[bal.denom] || bal.denom;
                return `  ${label}: ${amount}`;
            }).join("\n");

            return `Wallet address: ${wallet.injective_address}\nOn-chain balances:\n${formatted}`;
        } catch (err) {
            Logger.warn({ message: `[fetchWalletContext] Failed: ${err}` });
            return null;
        }
    }

    public async handleMessage(userId: string, telegramUserName: string, text: string): Promise<string> {
        try {
            const t0 = Date.now();

            const runtime = await this.getActiveRuntime(userId);
            if (!runtime) {
                return "You don't have an active agent. Please use /createagent to launch one!";
            }
            Logger.info({ message: `[handleMessage] Runtime loaded in ${Date.now() - t0}ms` });

            const agentDoc = await Agent.findOne({ user_id: userId, status: "active" });
            if (!agentDoc) {
                Logger.warn({ message: `[handleMessage] No active agent found for user ${userId}` });
                return "You don't have an active agent. Please use /createagent to launch one!";
            }
            const character = runtime.character;

            // Construct user memory early (so composeState can use it)
            const userMemory: Memory = {
                id: stringToUuid(Date.now().toString()),
                userId: stringToUuid(userId),
                agentId: runtime.agentId,
                roomId: agentDoc.room_id as UUID,
                content: { text, source: "telegram" },
                createdAt: Date.now(),
            };

            // Fetch recent conversation history from memory
            const t1 = Date.now();
            const recentMemories = await runtime.messageManager.getMemories({
                roomId: agentDoc.room_id as UUID,
                count: 8,
            });
            Logger.info({ message: `[handleMessage] Memory fetched in ${Date.now() - t1}ms` });

            // Build conversation history string
            const historyLines = recentMemories
                .reverse()
                .map(m => {
                    const isAgent = m.agentId === runtime.agentId && m.userId === runtime.agentId;
                    const speaker = isAgent ? (character.name || "Agent") : (telegramUserName || "User");
                    return `${speaker}: ${m.content?.text || ""}`;
                })
                .join("\n");

            // Detect if this is a balance/portfolio query and inject real data
            const balanceKeywords = /balance|portfolio|how much|inj|usdt|token|asset|worth|wallet/i;
            let walletContext = "";
            if (balanceKeywords.test(text)) {
                Logger.info({ message: `[handleMessage] Balance query detected — fetching real on-chain data` });
                const ctx = await this.fetchWalletContext(agentDoc._id);
                if (ctx) {
                    walletContext = `\n[REAL WALLET DATA — use these exact numbers, do NOT make up values]\n${ctx}\n`;
                }
            }

            // Direct Ollama call — one shot, plain text
            const ollama = createOllama({
                baseURL: ENV.OLLAMA_API_URL || "http://localhost:11434/api"
            });

            const bio = Array.isArray(character.bio)
                ? character.bio.slice(0, 2).join(" ")
                : (character.bio || "");

            // Fetch Eliza's state to get provider data (like wallet info)
            const elizaState = await runtime.composeState(userMemory);
            const providerContext = elizaState.walletInfo || ""; 

            const prompt = `You are ${character.name}. ${bio}

[RELEVANT CONTEXT]
${providerContext}
${walletContext}

[INSTRUCTIONS]
- To send/transfer tokens, conclude your response ONLY when you have the actual recipient address and amount, with this exact JSON: \`\`\`json\n{"action":"SEND_TOKEN", "recipient":"actual_injective_address", "amount":1.5, "denom":"INJ"}\n\`\`\`
- To swap tokens, conclude your response ONLY when you know the amount to swap, with this exact JSON: \`\`\`json\n{"action":"SWAP_TOKEN", "fromToken":"USDT", "toToken":"INJ", "amount":1.5}\n\`\`\`
- IF you are missing information (like the recipient address or the amount), ASK the user for it. Do NOT output a JSON block with placeholders like "[address]" or "[number]".
- Otherwise, just chat normally. Do NOT output JSON if you only want to chat.

Conversation:
${historyLines}
${telegramUserName || "User"}: ${text}
${character.name}:`;

            const t3 = Date.now();
            const { text: responseText } = await aiSdkGenerateText({
                model: ollama("llama3.2:3b"),
                prompt,
                maxTokens: 256,
            });
            Logger.info({ message: `[handleMessage] Text generated in ${Date.now() - t3}ms` });

            const reply = responseText?.trim();
            if (!reply) {
                Logger.warn({ message: `[handleMessage] Empty response from Ollama` });
                return "I processed your message but had nothing to say. Try again!";
            }

            // Clean up the reply and detect JSON action matching
            let finalReply = reply;
            const actionKeywords = ["SEND_TOKEN", "SWAP_TOKEN"];
            const detectedAction = actionKeywords.find(a => reply.includes(a));
            
            // Try to match a JSON block (wrapped in markdown or raw object)
            let jsonMatch = reply.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (!jsonMatch) {
                jsonMatch = reply.match(/(\{[\s\S]*?"action"\s*:\s*"(?:SEND_TOKEN|SWAP_TOKEN)"[\s\S]*?\})/);
            }
            
            // If the LLM returned a JSON block for an action, execute it via the custom wrapper
            if (jsonMatch && detectedAction) {
                try {
                    const actionData = JSON.parse(jsonMatch[1]);
                    
                    // STRICT VALIDATION
                    const amountRaw = Number(actionData.amount);
                    if (isNaN(amountRaw) || amountRaw <= 0) {
                        throw new Error("Invalid or missing transaction amount. Please provide a valid positive number.");
                    }
                    if (actionData.action === "SEND_TOKEN" && (!actionData.recipient || actionData.recipient.includes("["))) {
                        throw new Error("Invalid recipient address. Please provide a real injective address.");
                    }
                    actionData.amount = amountRaw; // Reassign the verified numeric value
                        const wallet = await Wallet.findOne({ agent_id: agentDoc._id });
                        if (!wallet) throw new Error("Agent wrapper wallet not configured yet.");
                        
                        const privateKey = decryptPrivateKey(wallet.encrypted_private_key);
                        Logger.info({ message: `[handleMessage] Executing action ${actionData.action} directly via wrapper.` });
                        
                        let txHash = "";
                        if (actionData.action === "SEND_TOKEN") {
                            txHash = await InjectiveService.sendTokens(privateKey, actionData.recipient, actionData.amount, actionData.denom || "INJ");
                            finalReply = `I have successfully sent ${actionData.amount} ${actionData.denom || "INJ"} to ${actionData.recipient}.\n\nTransaction Hash: ${txHash}`;
                        } else if (actionData.action === "SWAP_TOKEN") {
                            txHash = await InjectiveService.swapTokens(privateKey, actionData.fromToken, actionData.toToken, actionData.amount);
                            finalReply = `I have successfully swapped ${actionData.amount} ${actionData.fromToken} on the Spot Market.\n\nTransaction Hash: ${txHash}`;
                        }
                } catch (err: any) {
                    Logger.error({ message: `[handleMessage] Custom wrapper action failed: ${err.message}` });
                    finalReply = `I tried to process your transaction but an error occurred: ${err.message}`;
                }
            }

            // Store user message + agent reply in memory for future context
            const agentMemory: Memory = {
                id: stringToUuid(uuidv4()),
                userId: runtime.agentId,
                agentId: runtime.agentId,
                roomId: agentDoc.room_id as UUID,
                content: { 
                    text: finalReply, 
                    source: "telegram",
                    action: detectedAction || undefined 
                },
                createdAt: Date.now() + 1,
            };
            await runtime.messageManager.createMemory(userMemory);
            await runtime.messageManager.createMemory(agentMemory);

            Logger.info({ message: `[handleMessage] Total: ${Date.now() - t0}ms — "${finalReply.substring(0, 80)}"` });
            return finalReply;

        } catch (error) {
            Logger.error({ message: `Error in AgentService.handleMessage: ${error}` });
            return "Sorry, I encountered an error while processing your request.";
        }
    }
}

export const agentService = new AgentService();
