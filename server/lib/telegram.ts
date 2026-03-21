import { Telegraf } from "telegraf";
import { ENV } from "./environments";
import { Logger } from "borgen";
import User from "../models/User";

class TelegramService {
  private bot: Telegraf;

  constructor() {
    if (!ENV.BOT_TOKEN) {
      throw new Error("BOT_TOKEN is not defined in environment variables");
    }
    this.bot = new Telegraf(ENV.BOT_TOKEN);
    this.setupHandlers();
  }

  private setupHandlers() {
    // /start command
    this.bot.start(async (ctx) => {
      const telegram_user_id = ctx.from.id.toString();
      const first_name = ctx.from.first_name || "Trader";

      try {
        let user = await User.findOne({ telegram_user_id });
        if (!user) {
          user = new User({ telegram_user_id });
          await user.save();
          Logger.info({ message: `New user registered: ${telegram_user_id}` });
        }

        await ctx.reply(
          `Welcome to Zenji, ${first_name}! 🚀\n\nI am your personal trading assistant on Injective.I can learn your strategy, execute trades on your behalf, and sends instant balance and performance updates.`
            
        );
      } catch (error) {
        Logger.error({ message: `Error in /start handler: ${error}` });
        await ctx.reply("Sorry, something went wrong while setting up your account. Please try again later.");
      }
    });

    // /help command
    this.bot.help((ctx) => {
      ctx.reply(
        "Available commands:\n/start - Start the bot and register\n/help - Show this help message\n\nYou can also describe your trading strategy in plain English!"
      );
    });

    // Generic text message handler
    this.bot.on("text", async (ctx) => {
      const message = ctx.message.text;
      await ctx.reply(`I received your message: "${message}".\n\nI'm currently being set up to process trading strategies. Stay tuned! 🛠️`);
    });
  }

  public async start() {
    try {
      Logger.info({ message: `Launching Telegram bot with token prefix: ${ENV.BOT_TOKEN ? ENV.BOT_TOKEN.substring(0, 5) + "..." : "undefined"}` });
      await this.bot.launch();
      Logger.info({ message: "Telegram bot launched successfully" });
    } catch (error) {
      Logger.error({ message: `Failed to launch Telegram bot: ${error}` });
      throw error;
    }
  }

  public stop(reason: string) {
    this.bot.stop(reason);
  }
}

export const telegramService = new TelegramService();
