import { Request, Response } from "express";
import { Logger } from "borgen";
import { whatsappClient } from "../../lib/whatsapp.ts";
import { authService } from "../../services/auth.service.ts";
import { agentService } from "../../services/agent.service.ts";
import User from "../../models/User.ts";
import { ENV } from "../../lib/environments.ts";

import { PROMPTS } from "../../lib/prompts.ts";

interface UserSession {
    state?: "AWAITING_LOGIN_USERNAME" | "AWAITING_LOGIN_PASSWORD" | "AWAITING_SIGNUP_USERNAME" | "AWAITING_SIGNUP_PASSWORD" | "AWAITING_AGENT_NAME" | "AWAITING_AGENT_PERSONA";
    tempData?: any;
}

export class WhatsAppController {
    private sessions: Map<string, UserSession> = new Map();

    /**
     * Webhook Verification (GET)
     */
    async verifyWebhook(req: Request, res: Response) {
        Logger.info({ message: "WhatsApp Webhook verification request received", query: req.query });
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        const VERIFY_TOKEN = ENV.WHATSAPP_VERIFY_TOKEN;

        if (mode && token) {
            if (mode === "subscribe" && token === VERIFY_TOKEN) {
                Logger.info({ message: "WhatsApp Webhook verified successfully" });
                return res.status(200).send(challenge);
            } else {
                Logger.warn({ message: "WhatsApp Webhook verification failed: token mismatch", received: token, expected: VERIFY_TOKEN });
                return res.sendStatus(403);
            }
        }
        res.sendStatus(400);
    }

    /**
     * Handle Incoming Messages (POST)
     */
    async handleWebhook(req: Request, res: Response) {
        Logger.info({ message: "WhatsApp Webhook POST received", body: JSON.stringify(req.body, null, 2) });
        try {
            // 0. Verify Signature (Optional but recommended)
            const signature = req.headers["x-hub-signature-256"] as string;
            Logger.info({ message: "WhatsApp signature check", signature });

            const body = req.body;

            if (body.object !== "whatsapp_business_account") {
                return res.sendStatus(404);
            }

            if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value) {
                const value = body.entry[0].changes[0].value;

                // Handle messages
                if (value.messages) {
                    const message = value.messages[0];
                    const from = message.from;
                    const waId = value.contacts?.[0]?.wa_id || from;
                    const contactName = value.contacts?.[0]?.profile?.name || "Trader";

                    let text = "";
                    let buttonId = "";

                    if (message.type === "text") {
                        text = message.text.body;
                    } else if (message.type === "interactive") {
                        if (message.interactive.type === "button_reply") {
                            buttonId = message.interactive.button_reply.id;
                            text = message.interactive.button_reply.title;
                        } else if (message.interactive.type === "list_reply") {
                            buttonId = message.interactive.list_reply.id;
                            text = message.interactive.list_reply.title;
                        }
                    }

                    if (!text && !buttonId) return res.sendStatus(200);

                    Logger.info({ message: `WhatsApp [${from}]: ${text || buttonId}` });

                    // 1. Get Session
                    let session = this.sessions.get(from);
                    if (!session) {
                        session = {};
                        this.sessions.set(from, session);
                    }

                    // 2. Identify User
                    const userResult = await authService.loginById(waId, "whatsapp");
                    const user = userResult?.user;

                    if (!user) {
                        return this.handleUnauthenticatedUser(from, contactName, text, buttonId, session, waId, res);
                    }

                    // 3. Handle Authenticated Flow
                    return this.handleAuthenticatedUser(from, user, text, buttonId, session, res);
                }
            }

            res.sendStatus(200);
        } catch (error: any) {
            Logger.error({ message: `Error handling WhatsApp webhook: ${error.message}` });
            console.error(error);
            res.sendStatus(500);
        }
    }

    private async sendMainMenu(from: string, userName: string) {
        await whatsappClient.sendListMessage(
            from,
            PROMPTS.MAIN_PAGE(userName),
            "Zenji Menu",
            [
                {
                    title: "Agent Management",
                    rows: [
                        { id: "cmd_create_agent", title: "🤖 Create Agent", description: "Design a new AI personality" },
                        { id: "cmd_my_agents", title: "📋 My Agents", description: "View your active agents" },
                        { id: "cmd_switch_agent", title: "🔄 Switch Agent", description: "Change your active agent" }
                    ]
                },
                {
                    title: "Account & Support",
                    rows: [
                        { id: "cmd_account", title: "💰 Account Balance", description: "Check your wallet funds" },
                        { id: "cmd_help", title: "❓ Help & Info", description: "Learn how to use Zenji" }
                    ]
                }
            ]
        );
    }

    private async handleUnauthenticatedUser(from: string, name: string, text: string, buttonId: string, session: UserSession, waId: string, res: Response) {
        // State machine for login/signup
        if (buttonId === "auth_login") {
            session.state = "AWAITING_LOGIN_USERNAME";
            await whatsappClient.sendMessage(from, PROMPTS.LOGIN_PROMPT);
            return res.sendStatus(200);
        }

        if (buttonId === "auth_signup") {
            session.state = "AWAITING_SIGNUP_USERNAME";
            await whatsappClient.sendMessage(from, PROMPTS.SIGNUP_PROMPT);
            return res.sendStatus(200);
        }

        switch (session.state) {
            case "AWAITING_LOGIN_USERNAME":
                session.tempData = { username: text };
                session.state = "AWAITING_LOGIN_PASSWORD";
                await whatsappClient.sendMessage(from, PROMPTS.LOGIN_PASSWORD_PROMPT);
                break;
            case "AWAITING_LOGIN_PASSWORD":
                const loginResult = await authService.login(session.tempData.username, text);
                if (loginResult) {
                    const user = loginResult.user;
                    user.whatsapp_user_id = waId;
                    user.whatsapp_user_phone = from;
                    await user.save();
                    session.state = undefined;
                    session.tempData = undefined;
                    await whatsappClient.sendMessage(from, PROMPTS.LOGIN_SUCCESS(user.user_name));
                    await this.sendMainMenu(from, user.user_name);
                } else {
                    session.state = undefined;
                    await whatsappClient.sendMessage(from, PROMPTS.LOGIN_FAILED);
                }
                break;
            case "AWAITING_SIGNUP_USERNAME":
                const existingUser = await User.findOne({ user_name: text });
                if (existingUser) {
                    await whatsappClient.sendMessage(from, PROMPTS.SIGNUP_FAILED);
                } else {
                    session.tempData = { username: text };
                    session.state = "AWAITING_SIGNUP_PASSWORD";
                    await whatsappClient.sendMessage(from, PROMPTS.SIGNUP_PASSWORD_PROMPT);
                }
                break;
            case "AWAITING_SIGNUP_PASSWORD":
                try {
                    const newUser = await authService.register({
                        user_name: session.tempData.username,
                        password: text,
                        whatsapp_user_id: waId,
                        whatsapp_user_phone: from,
                        whatsapp_user_name: name
                    });
                    session.state = undefined;
                    session.tempData = undefined;
                    await whatsappClient.sendMessage(from, PROMPTS.SIGNUP_SUCCESS(newUser.user_name));
                    await this.sendMainMenu(from, newUser.user_name);
                } catch (err) {
                    session.state = undefined;
                    await whatsappClient.sendMessage(from, PROMPTS.ERROR_GENERIC);
                }
                break;
            default:
                await whatsappClient.sendReplyButtons(from, PROMPTS.WELCOME_NEW_USER(name), [
                    { id: "auth_login", title: "Login" },
                    { id: "auth_signup", title: "Sign Up" }
                ]);
        }
        return res.sendStatus(200);
    }

    private async handleAuthenticatedUser(from: string, user: any, text: string, buttonId: string, session: UserSession, res: Response) {
        const userId = user._id.toString();

        // Handle Cancel
        if (text.toLowerCase() === "/cancel" || buttonId === "cmd_cancel") {
            session.state = undefined;
            session.tempData = undefined;
            await whatsappClient.sendMessage(from, PROMPTS.CANCELLED);
            await this.sendMainMenu(from, user.user_name);
            return res.sendStatus(200);
        }

        // Handle Button/List IDs
        if (buttonId === "cmd_create_agent") {
            session.state = "AWAITING_AGENT_NAME";
            await whatsappClient.sendMessage(from, PROMPTS.CREATE_AGENT_PROMPT);
            return res.sendStatus(200);
        }
        if (buttonId === "cmd_my_agents") {
            return this.handleMyAgentsCommand(from, userId, res);
        }
        if (buttonId === "cmd_account") {
            return this.handleAccountCommand(from, userId, user.user_name, res);
        }
        if (buttonId === "cmd_switch_agent") {
            return this.handleSwitchAgentCommand(from, userId, res);
        }
        if (buttonId === "cmd_help") {
            await this.sendMainMenu(from, user.user_name);
            return res.sendStatus(200);
        }
        if (buttonId?.startsWith("switch_agent:")) {
            const agentId = buttonId.split(":")[1];
            const agent = await agentService.selectAgent(userId, agentId);
            if (agent) {
                await whatsappClient.sendMessage(from, `✅ Switched to agent: *${agent.name}*\n\nYou can now chat with them!`);
            } else {
                await whatsappClient.sendMessage(from, "❌ Agent not found.");
            }
            await this.sendMainMenu(from, user.user_name);
            return res.sendStatus(200);
        }

        // Handle States
        if (session.state === "AWAITING_AGENT_NAME") {
            session.tempData = { agentName: text };
            session.state = "AWAITING_AGENT_PERSONA";
            await whatsappClient.sendMessage(from, PROMPTS.CREATE_AGENT_PERSONA_PROMPT);
            return res.sendStatus(200);
        }

        if (session.state === "AWAITING_AGENT_PERSONA") {
            const name = session.tempData.agentName;
            const persona = text;
            session.state = undefined;
            session.tempData = undefined;

            await whatsappClient.sendMessage(from, PROMPTS.CREATE_AGENT_WAIT(name));
            try {
                const result = await agentService.createNewAgent(userId, name, persona);
                await whatsappClient.sendMessage(from, PROMPTS.CREATE_AGENT_SUCCESS(
                    name, persona, result.wallet.injective_address, result.wallet.ethereum_address
                ));
            } catch (err: any) {
                await whatsappClient.sendMessage(from, `❌ Failed to create agent: ${err.message}`);
            }
            await this.sendMainMenu(from, user.user_name);
            return res.sendStatus(200);
        }

        // Handle Commands (Text fallback)
        if (text.toLowerCase() === "/start" || text.toLowerCase() === "/help") {
            await this.sendMainMenu(from, user.user_name);
            return res.sendStatus(200);
        }

        if (text.toLowerCase() === "/createagent") {
            session.state = "AWAITING_AGENT_NAME";
            await whatsappClient.sendMessage(from, PROMPTS.CREATE_AGENT_PROMPT);
            return res.sendStatus(200);
        }

        if (text.toLowerCase() === "/account") {
            return this.handleAccountCommand(from, userId, user.user_name, res);
        }

        if (text.toLowerCase() === "/myagents") {
            return this.handleMyAgentsCommand(from, userId, res);
        }

        // Default: Natural Language Processing
        const response = await agentService.handleMessage(userId, user.user_name, text);
        await whatsappClient.sendMessage(from, response);
        return res.sendStatus(200);
    }

    private async handleAccountCommand(from: string, userId: string, userName: string, res: Response) {
        const activeAgent = await agentService.getActiveAgent(userId);
        if (!activeAgent) {
            await whatsappClient.sendMessage(from, PROMPTS.NO_ACTIVE_AGENT);
            return res.sendStatus(200);
        }
        const response = await agentService.handleMessage(userId, userName, "check my balance");
        await whatsappClient.sendMessage(from, response);
        await this.sendMainMenu(from, userName);
        return res.sendStatus(200);
    }

    private async handleMyAgentsCommand(from: string, userId: string, res: Response) {
        const agents = await agentService.getAgentsForUser(userId);
        if (!agents || agents.length === 0) {
            await whatsappClient.sendMessage(from, PROMPTS.NO_ACTIVE_AGENT);
        } else {
            let msg = PROMPTS.AGENT_LIST_HEADER + "\n\n";
            agents.forEach(a => {
                const marker = a.status === "active" ? "✅" : "⬜";
                msg += `${marker} *${a.name}*\nPersona: ${a.persona}\n\n`;
            });
            await whatsappClient.sendMessage(from, msg);
        }
        const user = await User.findOne({ whatsapp_user_id: from }) || await User.findOne({ whatsapp_user_phone: from });
        await this.sendMainMenu(from, user?.user_name || "Trader");
        return res.sendStatus(200);
    }

    private async handleSwitchAgentCommand(from: string, userId: string, res: Response) {
        const agents = await agentService.getAgentsForUser(userId);
        if (!agents || agents.length < 2) {
            await whatsappClient.sendMessage(from, "You need at least 2 agents to switch.");
            return res.sendStatus(200);
        }

        const rows = agents.map(a => ({
            id: `switch_agent:${a._id}`,
            title: a.name,
            description: a.status === "active" ? "Currently Active" : "Click to activate"
        }));

        await whatsappClient.sendListMessage(from, "Select which agent to activate:", "Select Agent", [
            { title: "Your Agents", rows }
        ]);
        return res.sendStatus(200);
    }
}

export const whatsappController = new WhatsAppController();
