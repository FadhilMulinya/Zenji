export const PROMPTS = {
    WELCOME_BACK: (name: string) => `Welcome back, ${name}! 🚀`,
    WELCOME_NEW_USER: (name: string) => `Welcome to Zenji, ${name}! 🚀\n\nI am your personal AI trading assistant on Injective.\n\nTo get started, please log in with your account or sign up if you're new here.`,

    MAIN_PAGE: (name: string) =>
        `👋 *Hello ${name}! Welcome to Zenji AI*\n\n` +
        `Zenji is your intelligent companion on the Injective blockchain. I can help you:\n` +
        `• 🤖 Create and manage personal AI agents\n` +
        `• 📊 Check balances and trade tokens\n` +
        `• 🛡️ Securely interact with dApps via chat\n\n` +
        `Tap the button below to view all operations.`,

    LOGIN_PROMPT: "Please enter your *username* to log in:",
    LOGIN_PASSWORD_PROMPT: "Great! Now enter your *password*:",
    LOGIN_SUCCESS: (username: string) => `✅ Logged in successfully as *${username}*! Your WhatsApp is now linked to your account.`,
    LOGIN_FAILED: "❌ Invalid username or password. Please try again or type /signup.",

    SIGNUP_PROMPT: "Let's create your Zenji account! Please choose a *username*:",
    SIGNUP_PASSWORD_PROMPT: "Now, choose a *password*:",
    SIGNUP_SUCCESS: (username: string) => `🎉 Account created successfully! Welcome, *${username}*! Your WhatsApp is now linked.`,
    SIGNUP_FAILED: "❌ That username is already taken or invalid. Please try another one.",

    CREATE_AGENT_PROMPT: "Let's create a new agent! What would you like to name them?",
    CREATE_AGENT_PERSONA_PROMPT: "Got it! Now, what should the persona of this agent be?\n\n(e.g. 'A sarcastic crypto trader' or 'A helpful financial assistant')",
    CREATE_AGENT_WAIT: (name: string) => `Standby, initializing ${name}... ⚙️`,
    CREATE_AGENT_SUCCESS: (name: string, persona: string, injAddress: string, evmAddress: string) =>
        `✅ Agent *${name}* created and activated!\n\n` +
        `Persona: ${persona}\n` +
        `Injective: \`${injAddress}\`\n` +
        `EVM: \`${evmAddress}\`\n\n` +
        `You can now chat with them directly!`,

    COMMANDS_HELP: "Available commands:\n" +
        "/start - Welcome & status\n" +
        "/createagent - Create a new AI agent\n" +
        "/myagents - View your agents\n" +
        "/switchagent - Switch active agent\n" +
        "/account - Check active agent's balance\n" +
        "/help - Show this message\n" +
        "/cancel - Cancel current operation",

    NO_ACTIVE_AGENT: "You don't have an active agent. Use /createagent to create one.",
    AGENT_LIST_HEADER: "🤖 *Your Agents:*",
    SWITCH_AGENT_PROMPT: "Select which agent to activate:",

    ERROR_GENERIC: "Sorry, I encountered an error. Please try again later.",
    CANCELLED: "Operation cancelled."
};
