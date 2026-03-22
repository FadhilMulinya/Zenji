import { Context, Markup } from "telegraf";
import { Logger } from "borgen";
import { ensureUser } from "../../services/user.service.ts";
import { getBalances, receiveFaucet } from "../../services/bank.service.ts";
import { agentService } from "../../services/agent.service.ts";
import Wallet from "../../models/Wallet.ts";

export interface MyContext extends Context {
  session: {
    state?: "awaiting_agent_name" | "awaiting_agent_persona";
    tempData?: any;
  };
}

// ── /start ──

export const handleStart = async (ctx: MyContext) => {
  const first_name = ctx.from!.first_name || "Trader";

  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || first_name);
    const activeAgent = await agentService.getActiveAgent(user._id.toString());

    if (activeAgent) {
      const wallet = await Wallet.findOne({ agent_id: activeAgent._id });
      await ctx.reply(
        `Welcome back, ${first_name}! 🚀\n\n` +
        `Active Agent: <b>${activeAgent.name}</b>\n` +
        (wallet ? `Wallet: <code>${wallet.injective_address}</code>\n\n` : "\n") +
        `Use /myagents to manage agents, /account to check balance, or just chat!`,
        { parse_mode: "HTML" }
      );
    } else {
      await ctx.reply(
        `Welcome to Zenji, ${first_name}! 🚀\n\n` +
        `I am your personal AI trading assistant on Injective.\n` +
        `Let's create your first agent to get started!`,
        Markup.inlineKeyboard([
          [Markup.button.callback("🤖 Create New Agent", "create_agent")],
        ])
      );
    }
  } catch (error) {
    Logger.error({ message: `Error in handleStart: ${error}` });
    await ctx.reply("Sorry, something went wrong.");
  }
};

// ── /account ── (shows active agent's wallet balance)

export const handleAccount = async (ctx: MyContext) => {
  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");
    const activeAgent = await agentService.getActiveAgent(user._id.toString());

    if (!activeAgent) {
      return ctx.reply("You don't have an active agent. Use /createagent to create one.");
    }

    const wallet = await Wallet.findOne({ agent_id: activeAgent._id });
    if (!wallet) {
      return ctx.reply("Agent wallet not found. Try creating a new agent.");
    }

    await ctx.reply(`Fetching balance for agent <b>${activeAgent.name}</b>... ⏳`, { parse_mode: "HTML" });
    const balances = await getBalances(wallet.injective_address);

    let balanceMsg = `💰 <b>${activeAgent.name}'s Wallet</b>\n`;
    balanceMsg += `Address: <code>${wallet.injective_address}</code>\n\n`;

    if (!balances || balances.length === 0) {
      balanceMsg += "No assets found.";
    } else {
      balances.forEach((bal: any) => {
        const amount = (parseFloat(bal.amount) / 1e18).toFixed(4);
        const denom = bal.denom.startsWith("factory/") ? bal.denom.split("/").pop() : bal.denom;
        balanceMsg += `• ${amount} ${denom!.toUpperCase()}\n`;
      });
    }

    await ctx.reply(balanceMsg, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🚰 Receive Test Tokens", "receive_faucet")],
      ]),
    });
  } catch (error) {
    Logger.error({ message: `Error in handleAccount: ${error}` });
    await ctx.reply("Failed to fetch balance.");
  }
};

// ── Faucet callback ──

export const handleFaucet = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");
    const activeAgent = await agentService.getActiveAgent(user._id.toString());
    if (!activeAgent) return ctx.reply("No active agent.");

    const wallet = await Wallet.findOne({ agent_id: activeAgent._id });
    if (!wallet) return ctx.reply("No wallet found.");

    await ctx.reply("Requesting test tokens from faucet... 🚰");
    await receiveFaucet(wallet.injective_address);
    await ctx.reply("Success! Check your balance in a few moments with /account.");
  } catch (error) {
    Logger.error({ message: `Error in handleFaucet: ${error}` });
    await ctx.reply("Faucet request failed. It might be rate-limited or currently unavailable.");
  }
};

// ── /createagent ──

export const handleCreateAgentPrompt = async (ctx: MyContext) => {
  if (ctx.callbackQuery) await ctx.answerCbQuery();
  ctx.session.state = "awaiting_agent_name";
  await ctx.reply("Let's create a new agent! What would you like to name them?");
};

// ── /myagents ── (shows ✅ on active agent)

export const handleMyAgents = async (ctx: MyContext) => {
  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");
    const userAgents = await agentService.getAgentsForUser(user._id.toString());

    if (!userAgents || userAgents.length === 0) {
      return ctx.reply("You have no agents. Create one to get started!", Markup.inlineKeyboard([
        [Markup.button.callback("🤖 Create New Agent", "create_agent")]
      ]));
    }

    let msg = "🤖 <b>Your Agents:</b>\n\n";
    userAgents.forEach(agent => {
      const marker = agent.status === "active" ? "✅" : "⬜";
      msg += `${marker} <b>${agent.name}</b>\n`;
      msg += `   Persona: <i>${agent.persona || agent.character_name}</i>\n`;
      msg += `   Status: <code>${agent.status}</code>\n\n`;
    });

    await ctx.reply(msg, {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🤖 Create New Agent", "create_agent")]
      ])
    });
  } catch (error) {
    Logger.error({ message: `Error in handleMyAgents: ${error}` });
    await ctx.reply("Failed to fetch your agents.");
  }
};

// ── /switchagent ── (inline buttons to switch)

export const handleSwitchAgent = async (ctx: MyContext) => {
  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");
    const userAgents = await agentService.getAgentsForUser(user._id.toString());

    if (!userAgents || userAgents.length === 0) {
      return ctx.reply("You have no agents. Use /createagent to create one.");
    }

    if (userAgents.length === 1) {
      return ctx.reply("You only have one agent. Create another with /createagent to switch between them.");
    }

    const buttons = userAgents.map(agent => {
      const label = agent.status === "active" ? `✅ ${agent.name} (current)` : `🔄 Switch to ${agent.name}`;
      return [Markup.button.callback(label, `switch_agent:${agent._id}`)];
    });

    await ctx.reply("Select which agent to activate:", Markup.inlineKeyboard(buttons));
  } catch (error) {
    Logger.error({ message: `Error in handleSwitchAgent: ${error}` });
    await ctx.reply("Failed to load agents.");
  }
};

// ── Switch agent callback ──

export const handleSwitchAgentCallback = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  try {
    const data = (ctx.callbackQuery as any)?.data as string;
    const agentMongoId = data.split(":")[1];
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");

    const agent = await agentService.selectAgent(user._id.toString(), agentMongoId);
    if (agent) {
      await ctx.editMessageText(`✅ Switched to agent: <b>${agent.name}</b>\n\nYou can now chat with them!`, { parse_mode: "HTML" });
    } else {
      await ctx.editMessageText("❌ Agent not found.");
    }
  } catch (error) {
    Logger.error({ message: `Error switching agent: ${error}` });
    await ctx.reply("Failed to switch agent.");
  }
};

// ── Generic text handler ──

export const handleText = async (ctx: MyContext) => {
  const state = ctx.session.state;
  const message = ctx.message && "text" in ctx.message ? ctx.message.text : "";
  if (!message) return;

  try {
    const user = await ensureUser(ctx.from!.id.toString(), ctx.from!.username || "");

    // No session state → route to NLP agent
    if (!state) {
      const response = await agentService.handleMessage(user._id.toString(), ctx.from!.username || "", message);
      await ctx.reply(response);
      return;
    }

    if (state === "awaiting_agent_name") {
      ctx.session.tempData = { agentName: message };
      ctx.session.state = "awaiting_agent_persona";
      await ctx.reply("Got it! Now, what should the persona of this agent be?\n\n(e.g. 'A sarcastic crypto trader' or 'A helpful financial assistant')");
    } else if (state === "awaiting_agent_persona") {
      const name = ctx.session.tempData?.agentName || "New Agent";
      const persona = message;

      ctx.session.state = undefined;
      ctx.session.tempData = undefined;

      await ctx.reply(`Standby, initializing ${name}... ⚙️`);
      try {
        const { agent, wallet } = await agentService.createNewAgent(user._id.toString(), name, persona);
        await ctx.reply(
          `✅ Agent <b>${name}</b> created and activated!\n\n` +
          `Persona: ${persona}\n` +
          `Wallet: <code>${wallet.injective_address}</code>\n\n` +
          `You can now chat with them directly!`,
          { parse_mode: "HTML" }
        );
      } catch (e) {
        Logger.error({ message: `Failed to create agent: ${e}` });
        await ctx.reply("❌ Error creating the agent. Please try again.");
      }
    }
  } catch (error) {
    Logger.error({ message: `handleText error: ${error}` });
    await ctx.reply("❌ Operation failed. Please try again or type /cancel.");
  }
};
