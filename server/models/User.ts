import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  telegram_user_id: string;
  created_at: Date;
  telegram_user_name: string;
}

const UserSchema: Schema = new Schema({
  telegram_user_id: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  telegram_user_name: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
