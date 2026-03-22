import { Telegraf, Context, session } from "telegraf";
import { ENV } from "./environments.ts";
import { Logger } from "borgen";
import * as tc from "../controllers/telegram/telegram.controller.ts";

class TelegramService {
  private bot: Telegraf<tc.MyContext>;

  constructor() {
    if (!ENV.BOT_TOKEN) {
      throw new Error("BOT_TOKEN is not defined in environment variables");
    }
    this.bot = new Telegraf<tc.MyContext>(ENV.BOT_TOKEN);

    // Session middleware
    this.bot.use(session());
    this.bot.use((ctx, next) => {
      ctx.session ??= {};
      return next();
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    // Commands
    this.bot.start(tc.handleStart);
    this.bot.command("account", tc.handleAccount);
    this.bot.command("myagents", tc.handleMyAgents);
    this.bot.command("switchagent", tc.handleSwitchAgent);
    this.bot.command("createagent", tc.handleCreateAgentPrompt);
    this.bot.command("help", (ctx) => {
      ctx.reply(
        "Available commands:\n" +
        "/start - Welcome & status\n" +
        "/createagent - Create a new AI agent\n" +
        "/myagents - View your agents\n" +
        "/switchagent - Switch active agent\n" +
        "/account - Check active agent's balance\n" +
        "/help - Show this message\n" +
        "/cancel - Cancel current operation"
      );
    });
    this.bot.command("cancel", async (ctx) => {
      ctx.session.state = undefined;
      ctx.session.tempData = undefined;
      await ctx.reply("Operation cancelled.");
    });

    // Callback actions
    this.bot.action("create_agent", tc.handleCreateAgentPrompt);
    this.bot.action("receive_faucet", tc.handleFaucet);
    this.bot.action(/^switch_agent:/, tc.handleSwitchAgentCallback);

    // Generic text
    this.bot.on("text", tc.handleText);
  }

  public async start() {
    try {
      Logger.info({ message: `Launching Telegram bot...` });
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
