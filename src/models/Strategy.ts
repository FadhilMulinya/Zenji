import mongoose, { Schema, Document } from "mongoose";

export interface IStrategy extends Document {
  user_id: mongoose.Types.ObjectId;
  wallet_id: mongoose.Types.ObjectId;
  raw_prompt: string;
  config_json: any;
  status: "draft" | "running" | "paused" | "stopped";
  created_at: Date;
  updated_at: Date;
}

const StrategySchema: Schema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    wallet_id: { type: Schema.Types.ObjectId, ref: "Wallet", required: true },
    raw_prompt: { type: String, required: true },
    config_json: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["draft", "running", "paused", "stopped"],
      default: "draft",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model<IStrategy>("Strategy", StrategySchema);



