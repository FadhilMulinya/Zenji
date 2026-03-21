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
    stringToUuid
} from "@elizaos/core";
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
            token: ENV.OPENAI_API_KEY || "", 
            modelProvider: ModelProviderName.OPENAI,
            character: {
                ...zenjiCharacter,
                name: agentDoc.name || "Zenji",
                id: agentDoc.agent_id as UUID,
                system: agentDoc.persona || zenjiCharacter.system, // Inject optional custom persona
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

        const agentDoc = await Agent.create({
            user_id: userId as any,
            name,
            persona,
            character_name: "Zenji",
            status: "active",
            agent_id: stringToUuid(uuidv4()),
            room_id: stringToUuid(uuidv4()),
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

            // Process message
            // Note: In a real Eliza setup, this involves evaluators and actions
            // For now, we use a simplified call to the runtime
            const state = await runtime.composeState(message);
            await runtime.processActions(message, [], state);
            
            // This is a placeholder. Real implementation needs to handle 
            // the AI response generation and action execution callbacks.
            return `Agent processed your request. (Integration in progress!)`;
        } catch (error) {
            Logger.error({ message: `Error in AgentService.handleMessage: ${error}` });
            return "Sorry, I encountered an error while processing your request.";
        }
    }
}

export const agentService = new AgentService();



