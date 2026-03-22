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
import { generateObject } from "ai";
import { createOllama } from "ollama-ai-provider";
import { z } from "zod";
import { injectivePlugin } from "@elizaos/plugin-injective";
import { v4 as uuidv4 } from "uuid";
import { MongoDBAdapter } from "./mongo-adapter.ts";
import { zenjiCharacter } from "../characters/zenji.character.ts";
import Wallet from "../models/Wallet.ts";
import Agent from "../models/Agent.ts";
import { ENV } from "./environments.ts";
import { Logger } from "borgen";
import { decryptPrivateKey } from "./crypto.ts";

class AgentService {
    private runtimes: Map<string, IAgentRuntime> = new Map();
    private adapter: MongoDBAdapter;
    private cache: CacheManager;

    constructor() {
        this.adapter = new MongoDBAdapter();
        this.cache = new CacheManager(new MemoryCacheAdapter());
    }

    public async getActiveRuntime(userId: string): Promise<IAgentRuntime | null> {
        // Find the active agent for this user
        const agentDoc = await Agent.findOne({ user_id: userId as any, status: "active" });
        if (!agentDoc) {
            return null; // No active agent
        }

        const agentIdStr = (agentDoc.agent_id as UUID).toString();

        if (this.runtimes.has(agentIdStr)) {
            return this.runtimes.get(agentIdStr)!;
        }

        const userWallet = await Wallet.findOne({ user_id: userId as any });
        if (!userWallet) {
            throw new Error("User has no wallet. Create one first.");
        }

        // Decrypt private key
        const privateKey = decryptPrivateKey(userWallet.encrypted_private_key);

        const runtime = new AgentRuntime({
            agentId: agentDoc.agent_id as UUID,
            databaseAdapter: this.adapter,
            cacheManager: this.cache,
            token: "", 
            modelProvider: ModelProviderName.OLLAMA,
            character: {
                ...zenjiCharacter,
                name: agentDoc.name || "Zenji",
                id: agentDoc.agent_id as UUID,
                system: agentDoc.persona || zenjiCharacter.system, // Inject optional custom persona
                ...(agentDoc.character_config || {}),
                settings: {
                    ...zenjiCharacter.settings,
                    secrets: {
                        ...(zenjiCharacter.settings?.secrets || {}),
                        "INJECTIVE_NETWORK": userWallet.network || "Testnet",
                        "INJECTIVE_PRIVATE_KEY": privateKey,
                        "EVM_PUBLIC_KEY": userWallet.ethereum_address,
                        "INJECTIVE_PUBLIC_KEY": userWallet.public_key_hex,
                    }
                }
            },
            plugins: [injectivePlugin],
        });

        await runtime.initialize();
        this.runtimes.set(agentIdStr, runtime);
        
        return runtime;
    }

    public async createNewAgent(userId: string, name: string, persona: string): Promise<any> {
        // Deactivate all other agents for this user
        await Agent.updateMany({ user_id: userId as any }, { status: "inactive" });

        let characterConfig = {};
        try {
            const ollama = createOllama({ baseURL: ENV.OLLAMA_API_URL || "http://localhost:11434/api" });
            const { object } = await generateObject({
                model: ollama("llama3.2:3b"),
                schema: z.object({
                    bio: z.array(z.string()),
                    lore: z.array(z.string()),
                    style: z.object({
                        all: z.array(z.string()),
                        chat: z.array(z.string()),
                        post: z.array(z.string()),
                    }),
                    adjectives: z.array(z.string()),
                    topics: z.array(z.string()),
                }),
                prompt: `Create a rich character profile for an AI agent named "${name}".\nPersona description:\n"${persona}"\n\nGenerate bio, lore, style guidelines, adjectives, and topics reflecting this persona.`
            });
            characterConfig = object;
        } catch (err) {
            Logger.error({ message: `Error generating character traits using Ollama: ${err}` });
        }

        const agentDoc = await Agent.create({
            user_id: userId as any,
            name,
            persona,
            character_name: "Zenji",
            status: "active",
            agent_id: stringToUuid(uuidv4()),
            room_id: stringToUuid(uuidv4()),
            character_config: characterConfig
        });

        return agentDoc;
    }

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



