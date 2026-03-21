import { Context, Markup } from "telegraf";
import { ensureUser } from "../user/user.controller.ts";
import { getBalances, receiveFaucet } from "../bank/bank.controller.ts";
import { createNewWallet, importWalletFromMnemonic, importWalletFromPrivateKey } from "../wallet/wallet.controller.ts";
import Wallet from "../../models/Wallet.ts";
import { Logger } from "borgen";
import { agentService } from "../../lib/agent.service.ts";
import Agent from "../../models/Agent.ts";

export interface MyContext extends Context {
  session: {
    state?: "awaiting_mnemonic" | "awaiting_private_key" | "awaiting_send_address" | "awaiting_send_amount";
    tempData?: any;
  };
}

export const handleStart = async (ctx: MyContext) => {
  const telegram_user_id = ctx.from!.id.toString();
  const telegram_user_name = ctx.from!.username || ctx.from!.first_name || "Trader";
  const first_name = ctx.from!.first_name || "Trader";

  try {
    const user = await ensureUser(telegram_user_id, telegram_user_name);
    const wallet = await Wallet.findOne({ user_id: user._id });

    if (wallet) {
      await ctx.reply(
        `Welcome back, ${first_name}! 🚀\n\nYour Injective wallet is already set up:\n\n` +
        `Native Address: <code>${wallet.injective_address}</code>\n` +
        `EVM Address: <code>${wallet.ethereum_address}</code>\n\n` +
        `Use /account to check your balance or /help to see more commands.`,
        { parse_mode: "HTML" }
      );
    } else {
      await ctx.reply(
        `Welcome to Zenji, ${first_name}! 🚀\n\nI am your personal trading assistant on Injective. To get started, I'll need to set up an Injective wallet for you.`,
        Markup.inlineKeyboard([
          [Markup.button.callback("🆕 Create New Wallet", "create_wallet")],
          [Markup.button.callback("📥 Import Seed Phrase", "import_mnemonic")],
          [Markup.button.callback("🔑 Import Private Key", "import_private_key")],
        ])
      );
    }
  } catch (error) {
    Logger.error({ message: `Error in handleStart: ${error}` });
    await ctx.reply("Sorry, something went wrong.");
  }
};

export const handleAccount = async (ctx: MyContext) => {
  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");
    const wallet = await Wallet.findOne({ user_id: user._id });

    if (!wallet) {
      return ctx.reply("Wait a minute, You don't have a wallet yet. Use /start to create one.");
    }

    await ctx.reply("Fetching your balance... ⏳");
    const balances = await getBalances(wallet.injective_address);

    let balanceMsg = `💰 <b>Your Balances:</b>\n\n`;
    if (!balances || balances.length === 0) {
      balanceMsg += "No assets found in your wallet.";
    } else {
      balances.forEach((bal: any) => {
        // Simple formatting for now. Injective uses 18 decimals usually.
        const amount = (parseFloat(bal.amount) / 1e18).toFixed(4);
        const denom = bal.denom.startsWith("factory/") ? bal.denom.split("/").pop() : bal.denom;
        balanceMsg += `• ${amount} ${denom!.toUpperCase()}\n`;
      });
    }

    await ctx.reply(balanceMsg, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🚰 Receive Test Tokens", "receive_faucet")],
        [Markup.button.callback("💸 Send Assets", "initiate_send")],
      ]),
    });
  } catch (error) {
    Logger.error({ message: `Error in handleAccount: ${error}` });
    await ctx.reply("Failed to fetch balance.");
  }
};

export const handleFaucet = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");
    const wallet = await Wallet.findOne({ user_id: user._id });

    if (!wallet) return ctx.reply("No wallet found.");

    await ctx.reply("Requesting test tokens from faucet... 🚰");
    await receiveFaucet(wallet.injective_address);
    await ctx.reply("Success! Check your balance in a few moments with /account.");
  } catch (error) {
    Logger.error({ message: `Error in handleFaucet: ${error}` });
    await ctx.reply("Faucet request failed. It might be rate-limited or currently unavailable.");
  }
};

export const handleCreateWallet = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText("Generating your new Injective wallet... ⏳");
  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");
    const wallet = await createNewWallet(user._id as any);
    await ctx.reply(
      `✅ Wallet created successfully!\n\n` +
      `Native Address: <code>${wallet.injective_address}</code>\n` +
      `EVM Address: <code>${wallet.ethereum_address}</code>\n\n` +
      `Keep your keys safe! Use /account to manage your balance.`,
      { parse_mode: "HTML" }
    );
  } catch (error) {
    await ctx.reply("Failed to create wallet.");
  }
};

export const handleImportMnemonicAction = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  ctx.session.state = "awaiting_mnemonic";
  await ctx.reply("Please send your 12 or 24-word seed phrase.");
};

export const handleImportPrivateKeyAction = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  ctx.session.state = "awaiting_private_key";
  await ctx.reply("Please send your private key (64 hex characters).");
};

export const handleInitiateSend = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  ctx.session.state = "awaiting_send_address";
  await ctx.reply("Please enter the recipient's Injective address (inj1...).");
};

export const handleText = async (ctx: MyContext) => {
  const state = ctx.session.state;
  const message = ctx.message && "text" in ctx.message ? ctx.message.text : "";

  if (!state) {
    const response = await agentService.handleMessage(ctx.from!.id.toString(), ctx.from!.username || "", message);
    await ctx.reply(response);
    return;
  }

  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");

    if (state === "awaiting_mnemonic") {
      await importWalletFromMnemonic(user._id as any, message);
      ctx.session.state = undefined;
      await ctx.reply("✅ Seed phrase imported successfully!");
    } else if (state === "awaiting_private_key") {
      await importWalletFromPrivateKey(user._id as any, message);
      ctx.session.state = undefined;
      await ctx.reply("✅ Private key imported successfully!");
    } else if (state === "awaiting_send_address") {
      if (!message.startsWith("inj1") || message.length !== 42) {
        return ctx.reply("❌ Invalid Injective address. Please try again or /cancel.");
      }
      ctx.session.tempData = { recipient: message };
      ctx.session.state = "awaiting_send_amount";
      await ctx.reply("How much INJ would you like to send?");
    } else if (state === "awaiting_send_amount") {
      const amount = parseFloat(message);
      if (isNaN(amount) || amount <= 0) {
        return ctx.reply("❌ Invalid amount. Please enter a positive number.");
      }
      
      const recipient = ctx.session.tempData.recipient;
      ctx.session.state = undefined;
      ctx.session.tempData = undefined;

      // In a real scenario, we'd call bankController.sendAssets here
      // But we'd need to decrypt the private key first.
      await ctx.reply(`🚀 Initiating transfer of ${amount} INJ to ${recipient}...\n\n(Transfer logic is being finalized!)`);
    }
  } catch (error) {
    await ctx.reply("❌ Operation failed. Please try again or type /cancel.");
  }
};

export const handleStatus = async (ctx: MyContext) => {
  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");
    const userAgents = await Agent.find({ user_id: user._id });

    if (!userAgents || userAgents.length === 0) {
      return ctx.reply("You have no active agents. Type something to launch one!");
    }

    let msg = "🤖 <b>Your Active Agents:</b>\n\n";
    userAgents.forEach(agent => {
      msg += `• <b>${agent.name}</b> (${agent.character_name})\nStatus: <code>${agent.status}</code>\n\n`;
    });

    await ctx.reply(msg, { parse_mode: "HTML" });
  } catch (error) {
    Logger.error({ message: `Error in handleStatus: ${error}` });
    await ctx.reply("Failed to fetch agent status.");
  }
};





