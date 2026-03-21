import mongoose, { Schema, Document } from "mongoose";
import { UUID } from "@elizaos/core";

export interface IAgent extends Document {
  user_id: mongoose.Types.ObjectId;
  name: string;
  character_name: string;
  status: "active" | "inactive";
  agent_id: UUID;
  room_id: UUID;
  created_at: Date;
  updated_at: Date;
}

const AgentSchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    character_name: { type: String, required: true, default: "Zenji" },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    agent_id: { type: String, required: true },
    room_id: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model<IAgent>("Agent", AgentSchema);



