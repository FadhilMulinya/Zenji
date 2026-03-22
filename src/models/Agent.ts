import mongoose, { Schema, Document } from "mongoose";
import { UUID } from "@elizaos/core";

export interface IAgent extends Document {
  user_id: string;
  name: string;
  character_name: string;
  persona: string;
  status: "active" | "inactive";
  agent_id: UUID;
  room_id: UUID;
  created_at: Date;
  updated_at: Date;
  character_config?: any; // Stores the generated Eliza character JSON
}

const AgentSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    character_name: { type: String, required: true, default: "Zenji" },
    persona: { type: String, required: false },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    agent_id: { type: String, required: true },
    room_id: { type: String, required: true },
    character_config: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model<IAgent>("Agent", AgentSchema);



