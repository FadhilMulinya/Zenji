import { Telegraf, Context, session } from "telegraf";
import { ENV } from "./environments.ts";
import { Logger } from "borgen";
import * as telegramController from "../controllers/telegram/telegram.controller.ts";

class TelegramService {
  private bot: Telegraf<telegramController.MyContext>;

  constructor() {
    if (!ENV.BOT_TOKEN) {
      throw new Error("BOT_TOKEN is not defined in environment variables");
    }
    this.bot = new Telegraf<telegramController.MyContext>(ENV.BOT_TOKEN);
    
    // Use Telegraf's built-in session middleware for in-memory session persistence
    this.bot.use(session());
    this.bot.use((ctx, next) => {
      ctx.session ??= {};
      return next();
    });

    this.setupHandlers();
  }

  private setupHandlers() {
    // Commands
    this.bot.start(telegramController.handleStart);
    this.bot.command("account", telegramController.handleAccount);
    this.bot.command("myagents", telegramController.handleMyAgents);
    this.bot.command("createagent", telegramController.handleCreateAgentPrompt);
    this.bot.command("help", (ctx) => {
      ctx.reply(
        "Available commands:\n/start - Manage your wallet\n/account - Check balance & faucet\n/myagents - View and manage your agents\n/createagent - Spawn a new AI agent\n/help - Show this message\n/cancel - Cancel current operation"
      );
    });
    this.bot.command("cancel", async (ctx) => {
      ctx.session.state = undefined;
      await ctx.reply("Operation cancelled.");
    });

    // Actions
    this.bot.action("create_wallet", telegramController.handleCreateWallet);
    this.bot.action("import_mnemonic", telegramController.handleImportMnemonicAction);
    this.bot.action("import_private_key", telegramController.handleImportPrivateKeyAction);
    this.bot.action("receive_faucet", telegramController.handleFaucet);
    this.bot.action("initiate_send", telegramController.handleInitiateSend);
    this.bot.action("create_agent", telegramController.handleCreateAgentPrompt);

    // Generic text
    this.bot.on("text", telegramController.handleText);
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



