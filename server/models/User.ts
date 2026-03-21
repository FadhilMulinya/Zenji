import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  telegram_user_id: string;
  telegram_user_name: string;
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  telegram_user_id: { type: String, required: true, unique: true },
  telegram_user_name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);
