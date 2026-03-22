import User from "../models/User.ts";
import { Logger } from "borgen";

export const ensureUser = async (telegram_user_id: string, telegram_user_name: string) => {
  try {
    let user = await User.findOne({ telegram_user_id });
    if (!user) {
      user = new User({ telegram_user_id, telegram_user_name });
      await user.save();
      Logger.info({ message: `New user registered: ${telegram_user_id} (${telegram_user_name})` });
    } else if (user.telegram_user_name !== telegram_user_name) {
      user.telegram_user_name = telegram_user_name;
      await user.save();
    }
    return user;
  } catch (error) {
    Logger.error({ message: `Error in ensureUser: ${error}` });
    throw error;
  }
};
