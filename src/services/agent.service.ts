import { 
    AgentRuntime,
    Character, 
    ModelProviderName, 
    UUID, 
    Memory, 
    IAgentRuntime,
    State,
    CacheManager, 
    MemoryCacheAdapter,
    ModelClass,
    composeContext,
    generateMessageResponse,
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
        plugins: [],
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
        return Agent.find({ user_id: userId as any });
    }

    public async getActiveAgent(userId: string) {
        return Agent.findOne({ user_id: userId as any, status: "active" });
    }

    public async selectAgent(userId: string, agentMongoId: string) {
        // Deactivate all agents for this user
        await Agent.updateMany({ user_id: userId as any }, { status: "inactive" });
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
        const agentDoc = await Agent.findOne({ user_id: userId as any, status: "active" });
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
        await Agent.updateMany({ user_id: userId as any }, { status: "inactive" });

        // 1. Generate AI traits (may fall back to defaults)
        const aiTraits = await generateCharacterTraits(name, persona);

        // 2. Build the FULL Eliza Character JSON
        const fullCharacter = buildFullCharacter(name, persona, aiTraits);

        // 3. Store agent + full character in DB
        const agentDoc = await Agent.create({
            user_id: userId as any,
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

    public async handleMessage(userId: string, telegramUserName: string, text: string): Promise<string> {
        try {
            const runtime = await this.getActiveRuntime(userId);
            if (!runtime) {
                return "You don't have an active agent. Please use /createagent to launch one!";
            }

            const agentDoc = await Agent.findOne({ user_id: userId as any, status: "active" });

            const message: Memory = {
                id: stringToUuid(Date.now().toString()),
                userId: stringToUuid(userId),
                agentId: runtime.agentId,
                roomId: agentDoc!.room_id as UUID,
                content: { text, source: "telegram" },
                createdAt: Date.now(),
            };

            await runtime.messageManager.createMemory(message);
            const state = await runtime.composeState(message);

            const messageHandlerTemplate = `# Action Examples
{{actionExamples}}

# Knowledge
{{knowledge}}

# Task: Generate dialog and actions for the character {{agentName}}.
About {{agentName}}:
{{bio}}
{{lore}}

{{providers}}

{{attachments}}

# Capabilities
Note that {{agentName}} is capable of reading/seeing/hearing various forms of media, including images, videos, audio, plaintext and PDFs. Recent attachments have been included above under the "Attachments" section.

{{messageDirections}}

{{recentMessages}}

{{actions}}

# Instructions: Write the next message for {{agentName}}.`;

            const context = composeContext({ state, template: messageHandlerTemplate });

            const responseContent = await generateMessageResponse({
                runtime,
                context,
                modelClass: ModelClass.SMALL
            });

            if (!responseContent) {
                return "Failed to generate a response. Please try again.";
            }

            const responseMemory: Memory = {
                id: stringToUuid(uuidv4()),
                userId: runtime.agentId,
                agentId: runtime.agentId,
                roomId: message.roomId,
                content: responseContent,
                createdAt: Date.now(),
            };

            await runtime.messageManager.createMemory(responseMemory);
            await runtime.processActions(message, [responseMemory], state);

            return responseContent.text;
        } catch (error) {
            Logger.error({ message: `Error in AgentService.handleMessage: ${error}` });
            return "Sorry, I encountered an error while processing your request.";
        }
    }
}

export const agentService = new AgentService();
