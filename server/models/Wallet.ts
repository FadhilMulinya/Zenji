import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  user_id: mongoose.Types.ObjectId;
  injective_address: string;
  encrypted_private_key: string;
  network: string;
  created_at: Date;
}

const WalletSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  injective_address: { type: String, required: true },
  encrypted_private_key: { type: String, required: true },
  network: { type: String, default: "testnet" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IWallet>("Wallet", WalletSchema);
