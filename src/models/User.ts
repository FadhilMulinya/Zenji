import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  user_name: string;
  password?: string;
  telegram_user_id?: string;
  telegram_user_name?: string;
  whatsapp_user_id?: string;
  whatsapp_user_name?: string;
  whatsapp_user_phone?: string;
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  user_name: { type: String, required: true },
  password: { type: String, required: true },
  telegram_user_id: { type: String, unique: true },
  telegram_user_name: { type: String },
  whatsapp_user_id: { type: String, unique: true },
  whatsapp_user_name: { type: String },
  whatsapp_user_phone: { type: String },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);



