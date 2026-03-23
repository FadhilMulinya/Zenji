import { Context, Markup } from "telegraf";
import { Logger } from "borgen";
import { authService } from "../../services/auth.service.ts";
import { agentService } from "../../services/agent.service.ts";
import { getBalances, receiveFaucet, formatBalances } from "../../services/bank.service.ts";
import Wallet from "../../models/Wallet.ts";
import User from "../../models/User.ts";
import { PROMPTS } from "../../lib/prompts.ts";

export interface MyContext extends Context {
  session: {
    state?: "AWAITING_LOGIN_USERNAME" | "AWAITING_LOGIN_PASSWORD" | "AWAITING_SIGNUP_USERNAME" | "AWAITING_SIGNUP_PASSWORD" | "awaiting_agent_name" | "awaiting_agent_persona";
    tempData?: any;
  };
}

// ── /start ──

export const handleStart = async (ctx: MyContext) => {
  const telegramId = ctx.from!.id.toString();
  const firstName = ctx.from!.first_name || "Trader";

  try {
    const userResult = await authService.loginById(telegramId, "telegram");

    if (userResult) {
      const user = userResult.user;
      const activeAgent = await agentService.getActiveAgent(user._id.toString());

      if (activeAgent) {
        const wallet = await Wallet.findOne({ agent_id: activeAgent._id });
        let msg = PROMPTS.WELCOME_BACK(user.user_name) + "\n\n";
        msg += `Active Agent: <b>${activeAgent.name}</b>\n`;
        if (wallet) {
          msg += `Injective: <code>${wallet.injective_address}</code>\n`;
          msg += `EVM: <code>${wallet.ethereum_address}</code>\n`;
        }
        msg += `\nUse /myagents to manage agents, /account to check balance, or just chat!`;
        await ctx.reply(msg, { parse_mode: "HTML" });
      } else {
        await ctx.reply(PROMPTS.WELCOME_BACK(user.user_name), { parse_mode: "HTML" });
        await ctx.reply(PROMPTS.NO_ACTIVE_AGENT, Markup.inlineKeyboard([
          [Markup.button.callback("🤖 Create New Agent", "create_agent")],
        ]));
      }
    } else {
      await ctx.reply(PROMPTS.WELCOME_NEW_USER(firstName), Markup.inlineKeyboard([
        [Markup.button.callback("🔑 Login", "auth_login"), Markup.button.callback("📝 Sign Up", "auth_signup")],
      ]));
    }
  } catch (error) {
    Logger.error({ message: `Error in handleStart: ${error}` });
    await ctx.reply(PROMPTS.ERROR_GENERIC);
  }
};

// ── Auth Callbacks ──

export const handleAuthLogin = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  ctx.session.state = "AWAITING_LOGIN_USERNAME";
  await ctx.reply(PROMPTS.LOGIN_PROMPT, { parse_mode: "Markdown" });
};

export const handleAuthSignup = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  ctx.session.state = "AWAITING_SIGNUP_USERNAME";
  await ctx.reply(PROMPTS.SIGNUP_PROMPT, { parse_mode: "Markdown" });
};

// ── /account ── (shows active agent's wallet balance)

export const handleAccount = async (ctx: MyContext) => {
  try {
    const userResult = await authService.loginById(ctx.from!.id.toString(), "telegram");
    if (!userResult) return ctx.reply(PROMPTS.WELCOME_NEW_USER(ctx.from!.first_name));

    const user = userResult.user;
    const activeAgent = await agentService.getActiveAgent(user._id.toString());

    if (!activeAgent) {
      return ctx.reply(PROMPTS.NO_ACTIVE_AGENT);
    }

    const wallet = await Wallet.findOne({ agent_id: activeAgent._id });
    if (!wallet) {
      return ctx.reply("Agent wallet not found.");
    }

    await ctx.reply(`Fetching balance for agent <b>${activeAgent.name}</b>... ⏳`, { parse_mode: "HTML" });
    const response = await agentService.handleMessage(user._id.toString(), user.user_name, "check my balance");
    await ctx.reply(response);
  } catch (error) {
    Logger.error({ message: `Error in handleAccount: ${error}` });
    await ctx.reply("Failed to fetch balance.");
  }
};

// ── Faucet callback ──

export const handleFaucet = async (ctx: MyContext) => {
  await ctx.answerCbQuery();
  try {
    const userResult = await authService.loginById(ctx.from!.id.toString(), "telegram");
    if (!userResult) return ctx.reply(PROMPTS.WELCOME_NEW_USER(ctx.from!.first_name));

    const user = userResult.user;
    const activeAgent = await agentService.getActiveAgent(user._id.toString());
    if (!activeAgent) return ctx.reply(PROMPTS.NO_ACTIVE_AGENT);

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
  await ctx.reply(PROMPTS.CREATE_AGENT_PROMPT);
};

// ── /myagents ── (shows ✅ on active agent)

export const handleMyAgents = async (ctx: MyContext) => {
  try {
    const userResult = await authService.loginById(ctx.from!.id.toString(), "telegram");
    if (!userResult) return ctx.reply(PROMPTS.WELCOME_NEW_USER(ctx.from!.first_name));

    const user = userResult.user;
    const userAgents = await agentService.getAgentsForUser(user._id.toString());

    if (!userAgents || userAgents.length === 0) {
      return ctx.reply(PROMPTS.NO_ACTIVE_AGENT, Markup.inlineKeyboard([
        [Markup.button.callback("🤖 Create New Agent", "create_agent")]
      ]));
    }

    let msg = PROMPTS.AGENT_LIST_HEADER + "\n\n";
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
    const userResult = await authService.loginById(ctx.from!.id.toString(), "telegram");
    if (!userResult) return ctx.reply(PROMPTS.WELCOME_NEW_USER(ctx.from!.first_name));

    const user = userResult.user;
    const userAgents = await agentService.getAgentsForUser(user._id.toString());

    if (!userAgents || userAgents.length === 0) {
      return ctx.reply(PROMPTS.NO_ACTIVE_AGENT);
    }

    if (userAgents.length === 1) {
      return ctx.reply("You only have one agent. Create another with /createagent to switch between them.");
    }

    const buttons = userAgents.map(agent => {
      const label = agent.status === "active" ? `✅ ${agent.name} (current)` : `🔄 Switch to ${agent.name}`;
      return [Markup.button.callback(label, `switch_agent:${agent._id}`)];
    });

    await ctx.reply("Select which agent to activate:", Markup.inlineKeyboard(buttons));
    await ctx.reply(PROMPTS.SWITCH_AGENT_PROMPT, Markup.inlineKeyboard(buttons));
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
    const userResult = await authService.loginById(ctx.from!.id.toString(), "telegram");
    if (!userResult) return ctx.editMessageText(PROMPTS.WELCOME_NEW_USER(ctx.from!.first_name));

    const user = userResult.user;
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

  const telegramId = ctx.from!.id.toString();

  try {
    const userResult = await authService.loginById(telegramId, "telegram");
    const user = userResult?.user;

    // Handle Auth States
    if (!user) {
      switch (state) {
        case "AWAITING_LOGIN_USERNAME":
          ctx.session.tempData = { username: message };
          ctx.session.state = "AWAITING_LOGIN_PASSWORD";
          await ctx.reply(PROMPTS.LOGIN_PASSWORD_PROMPT, { parse_mode: "Markdown" });
          return;
        case "AWAITING_LOGIN_PASSWORD":
          const loginRes = await authService.login(ctx.session.tempData.username, message);
          if (loginRes) {
            const u = loginRes.user;
            u.telegram_user_id = telegramId;
            u.telegram_user_name = ctx.from!.username || ctx.from!.first_name;
            await u.save();
            ctx.session.state = undefined;
            ctx.session.tempData = undefined;
            await ctx.reply(PROMPTS.LOGIN_SUCCESS(u.user_name), { parse_mode: "Markdown" });
            await ctx.reply(PROMPTS.WELCOME_BACK(u.user_name));
          } else {
            ctx.session.state = undefined;
            await ctx.reply(PROMPTS.LOGIN_FAILED);
          }
          return;
        case "AWAITING_SIGNUP_USERNAME":
          const existing = await User.findOne({ user_name: message });
          if (existing) {
            await ctx.reply(PROMPTS.SIGNUP_FAILED);
          } else {
            ctx.session.tempData = { username: message };
            ctx.session.state = "AWAITING_SIGNUP_PASSWORD";
            await ctx.reply(PROMPTS.SIGNUP_PASSWORD_PROMPT, { parse_mode: "Markdown" });
          }
          return;
        case "AWAITING_SIGNUP_PASSWORD":
          try {
            const newUser = await authService.register({
              user_name: ctx.session.tempData.username,
              password: message,
              telegram_user_id: telegramId,
              telegram_user_name: ctx.from!.username || ctx.from!.first_name
            });
            ctx.session.state = undefined;
            ctx.session.tempData = undefined;
            await ctx.reply(PROMPTS.SIGNUP_SUCCESS(newUser.user_name), { parse_mode: "Markdown" });
            await ctx.reply(PROMPTS.COMMANDS_HELP);
          } catch (e) {
            ctx.session.state = undefined;
            await ctx.reply(PROMPTS.ERROR_GENERIC);
          }
          return;
        default:
          await ctx.reply(PROMPTS.WELCOME_NEW_USER(ctx.from!.first_name), Markup.inlineKeyboard([
            [Markup.button.callback("🔑 Login", "auth_login"), Markup.button.callback("📝 Sign Up", "auth_signup")],
          ]));
          return;
      }
    }

    // Authenticated Flow
    // No session state → route to NLP agent
    if (!state) {
      // Send typing indicator immediately so the user knows we're working
      await ctx.sendChatAction("typing");

      // Process in the background with full error handling
      const userId = user._id.toString();
      const username = ctx.from!.username || "";
      const chatId = ctx.chat!.id;

      (async () => {
        try {
          Logger.info({ message: `[NLP] Processing message from ${username}: "${message.substring(0, 50)}..."` });
          const startTime = Date.now();

          const response = await agentService.handleMessage(userId, username, message);

          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          Logger.info({ message: `[NLP] Response generated in ${elapsed}s` });

          if (response && response.trim().length > 0) {
            await ctx.telegram.sendMessage(chatId, response);
          } else {
            Logger.warn({ message: `[NLP] Empty response from agent, sending fallback.` });
            await ctx.telegram.sendMessage(chatId, "I processed your message but didn't have a specific response. Try asking differently!");
          }
        } catch (err: any) {
          Logger.error({ message: `[NLP] Error: ${err.message || err}` });
          try {
            await ctx.telegram.sendMessage(chatId, "Sorry, I encountered an error while thinking. Please try again.");
          } catch (_) { /* ctx might be stale */ }
        }
      })();
      return;
    }

    if (state === "awaiting_agent_name") {
      ctx.session.tempData = { agentName: message };
      ctx.session.state = "awaiting_agent_persona";
      await ctx.reply(PROMPTS.CREATE_AGENT_PERSONA_PROMPT);
    } else if (state === "awaiting_agent_persona") {
      const name = ctx.session.tempData?.agentName;
      const persona = message;

      ctx.session.state = undefined;
      ctx.session.tempData = undefined;

      await ctx.reply(PROMPTS.CREATE_AGENT_WAIT(name));
      const chatId = ctx.chat!.id;
      (async () => {
        try {
          const { agent, wallet } = await agentService.createNewAgent(user._id.toString(), name, persona);
          await ctx.telegram.sendMessage(chatId,
            PROMPTS.CREATE_AGENT_SUCCESS(name, persona, wallet.injective_address, wallet.ethereum_address),
            { parse_mode: "HTML" }
          );
        } catch (e) {
          Logger.error({ message: `Failed to create agent: ${e}` });
          await ctx.telegram.sendMessage(chatId, "❌ Error creating the agent. Please try again.");
        }
      })();
    }
  } catch (error) {
    Logger.error({ message: `handleText error: ${error}` });
    await ctx.reply(PROMPTS.ERROR_GENERIC);
  }
};
