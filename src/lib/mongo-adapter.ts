import { 
    DatabaseAdapter,
    Account, 
    Actor, 
    GoalStatus, 
    Goal, 
    Memory, 
    Content, 
    Relationship, 
    UUID, 
    RAGKnowledgeItem, 
    Participant,
    elizaLogger
} from "@elizaos/core";
import MemoryModel from "../models/Memory.ts";
import AgentModel from "../models/Agent.ts";
import UserModel from "../models/User.ts";

export class MongoDBAdapter extends DatabaseAdapter {
    constructor() {
        super();
    }

    async init(): Promise<void> {
        // Mongoose connection is handled by server/database/connectDB.ts
        return Promise.resolve();
    }

    async close(): Promise<void> {
        return Promise.resolve();
    }

    async getAccountById(userId: UUID): Promise<Account | null> {
        const user = await UserModel.findOne({ telegram_user_id: userId });
        if (!user) return null;
        return {
            id: userId,
            name: user.telegram_user_name,
            username: user.telegram_user_name,
            details: {}
        };
    }

    async createAccount(account: Account): Promise<boolean> {
        // User creation is handled by ensureUser in Zenji
        return true;
    }

    async getMemories(params: {
        agentId: UUID;
        roomId: UUID;
        count?: number;
        unique?: boolean;
        tableName: string;
    }): Promise<Memory[]> {
        const query: any = { agentId: params.agentId, roomId: params.roomId };
        if (params.unique) query.unique = true;
        
        const docs = await MemoryModel.find(query)
            .sort({ createdAt: -1 })
            .limit(params.count || 10);
            
        return docs.map(doc => ({
            id: doc.id,
            userId: doc.userId,
            agentId: doc.agentId,
            roomId: doc.roomId,
            content: doc.content as unknown as Content,
            embedding: doc.embedding,
            unique: doc.unique,
            createdAt: doc.createdAt
        }));
    }

    async getMemoriesByRoomIds(params: {
        agentId: UUID;
        roomIds: UUID[];
        tableName: string;
        limit?: number;
    }): Promise<Memory[]> {
        const docs = await MemoryModel.find({ 
            agentId: params.agentId, 
            roomId: { $in: params.roomIds } 
        })
        .sort({ createdAt: -1 })
        .limit(params.limit || 10);

        return docs.map(doc => ({
            id: doc.id,
            userId: doc.userId,
            agentId: doc.agentId,
            roomId: doc.roomId,
            content: doc.content as unknown as Content,
            embedding: doc.embedding,
            unique: doc.unique,
            createdAt: doc.createdAt
        }));
    }

    async getMemoryById(id: UUID): Promise<Memory | null> {
        const doc = await MemoryModel.findOne({ id });
        return doc ? {
            id: doc.id,
            userId: doc.userId,
            agentId: doc.agentId,
            roomId: doc.roomId,
            content: doc.content as unknown as Content,
            embedding: doc.embedding,
            unique: doc.unique,
            createdAt: doc.createdAt
        } : null;
    }

    async getMemoriesByIds(memoryIds: UUID[], tableName?: string): Promise<Memory[]> {
        const docs = await MemoryModel.find({ id: { $in: memoryIds } });
        return docs.map(doc => ({
            id: doc.id,
            userId: doc.userId,
            agentId: doc.agentId,
            roomId: doc.roomId,
            content: doc.content as unknown as Content,
            embedding: doc.embedding,
            unique: doc.unique,
            createdAt: doc.createdAt
        }));
    }

    async getCachedEmbeddings(params: any): Promise<any[]> {
        // Implementation for vector search/cache if needed
        return [];
    }

    async log(params: {
        body: { [key: string]: unknown };
        userId: UUID;
        roomId: UUID;
        type: string;
    }): Promise<void> {
        elizaLogger.info(`Log: ${params.type}`, params.body);
    }

    async getActorDetails(params: { roomId: UUID }): Promise<Actor[]> {
        // Simplified: return user details if associated with room
        return [];
    }

    async searchMemories(params: any): Promise<Memory[]> {
        // Implementation for vector search
        return [];
    }

    async updateGoalStatus(params: { goalId: UUID; status: GoalStatus }): Promise<void> {
        // Goals not yet implemented in Zenji models
    }

    async searchMemoriesByEmbedding(embedding: number[], params: any): Promise<Memory[]> {
        // Vector search implementation
        return [];
    }

    async createMemory(memory: Memory, tableName: string, unique?: boolean): Promise<void> {
        await MemoryModel.create({
            id: memory.id || crypto.randomUUID(),
            userId: memory.userId,
            agentId: memory.agentId,
            roomId: memory.roomId,
            content: memory.content,
            embedding: memory.embedding,
            unique: !!unique,
            createdAt: memory.createdAt || Date.now()
        });
    }

    async removeMemory(memoryId: UUID, tableName: string): Promise<void> {
        await MemoryModel.deleteOne({ id: memoryId });
    }

    async removeAllMemories(roomId: UUID, tableName: string): Promise<void> {
        await MemoryModel.deleteMany({ roomId });
    }

    async countMemories(roomId: UUID, unique?: boolean, tableName?: string): Promise<number> {
        const query: any = { roomId };
        if (unique) query.unique = true;
        return await MemoryModel.countDocuments(query);
    }

    async getGoals(params: any): Promise<Goal[]> {
        return [];
    }

    async updateGoal(goal: Goal): Promise<void> {}
    async createGoal(goal: Goal): Promise<void> {}
    async removeGoal(goalId: UUID): Promise<void> {}
    async removeAllGoals(roomId: UUID): Promise<void> {}

    async getRoom(roomId: UUID): Promise<UUID | null> {
        const agent = await AgentModel.findOne({ room_id: roomId });
        return agent ? (roomId as UUID) : null;
    }

    async createRoom(roomId?: UUID): Promise<UUID> {
        return (roomId || crypto.randomUUID()) as UUID;
    }

    async removeRoom(roomId: UUID): Promise<void> {
        await AgentModel.deleteOne({ room_id: roomId });
    }

    async getRoomsForParticipant(userId: UUID): Promise<UUID[]> {
        const agents = await AgentModel.find({ user_id: userId });
        return agents.map(a => a.room_id as UUID);
    }

    async getRoomsForParticipants(userIds: UUID[]): Promise<UUID[]> {
        const agents = await AgentModel.find({ user_id: { $in: userIds } });
        return agents.map(a => a.room_id as UUID);
    }

    async addParticipant(userId: UUID, roomId: UUID): Promise<boolean> {
        return true;
    }

    async removeParticipant(userId: UUID, roomId: UUID): Promise<boolean> {
        return true;
    }

    async getParticipantsForAccount(userId: UUID): Promise<Participant[]> {
        return [];
    }

    async getParticipantsForRoom(roomId: UUID): Promise<UUID[]> {
        return [];
    }

    async getParticipantUserState(roomId: UUID, userId: UUID): Promise<any> {
        return null;
    }

    async setParticipantUserState(roomId: UUID, userId: UUID, state: any): Promise<void> {}

    async createRelationship(params: any): Promise<boolean> {
        return true;
    }

    async getRelationship(params: any): Promise<Relationship | null> {
        return null;
    }

    async getRelationships(params: any): Promise<Relationship[]> {
        return [];
    }

    async getKnowledge(params: any): Promise<RAGKnowledgeItem[]> {
        return [];
    }

    async searchKnowledge(params: any): Promise<RAGKnowledgeItem[]> {
        return [];
    }

    async createKnowledge(knowledge: RAGKnowledgeItem): Promise<void> {}
    async removeKnowledge(id: UUID): Promise<void> {}
    async clearKnowledge(agentId: UUID, shared?: boolean): Promise<void> {}
}



