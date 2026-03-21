import mongoose, { Schema, Document } from "mongoose";
import { UUID } from "@elizaos/core";

export interface IMemory extends Document {
  id: UUID;
  userId: UUID;
  agentId: UUID;
  roomId: UUID;
  content: {
    text: string;
    action?: string;
    source?: string;
    url?: string;
    inReplyTo?: UUID;
    attachments?: any[];
    [key: string]: any;
  };
  embedding?: number[];
  unique: boolean;
  createdAt: number;
}

const MemorySchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  agentId: { type: String, required: true },
  roomId: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  embedding: { type: [Number], index: "2dsphere" }, // Generic index, vector search might need specific DB config
  unique: { type: Boolean, default: false },
  createdAt: { type: Number, required: true },
});

// Create index for memory queries
MemorySchema.index({ agentId: 1, roomId: 1, createdAt: -1 });

export default mongoose.model<IMemory>("Memory", MemorySchema);



