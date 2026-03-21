import mongoose, { Schema, Document } from "mongoose";

export interface IWallet extends Document {
  user_id: mongoose.Types.ObjectId;
  injective_address: string;
  ethereum_address: string;
  public_key_hex: string;
  encrypted_private_key: string;
  encrypted_mnemonic?: string;
  network: string;
  created_at: Date;
}

const WalletSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  injective_address: { type: String, required: true },
  ethereum_address: { type: String, required: true },
  public_key_hex: { type: String, required: true },
  encrypted_private_key: { type: String, required: true },
  encrypted_mnemonic: { type: String },
  network: { type: String, default: "testnet" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IWallet>("Wallet", WalletSchema);



