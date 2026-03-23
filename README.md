# Zenji – Launch On-Chain Trading Agents with Zenji

Zenji is a **social toolkit** that lets anyone create and run automated trading agents on **Injective** just by chatting in natural language. 

### 🚀 Try it Now
The official Zenji is live on Telegram: **[@injzenji_bot](https://t.me/injzenji_bot)** and whatsapp via this number **wa.me/+254799544307**.  
Simply start a chat to set up your account and begin launching your own trading agents and strategies!

Currently everything is on testnet , and we are using local LLMs to run the agents , hence the uptime is not guaranteed since we are relying on my local machines to run the agents.

---

Each agent is your **trading partner**: chat with it for tips, insights, or to execute transactions. Each agent operates independently with its own:
- **Unique Wallet** (Injective & EVM)
- **Distinct Character & Persona** (Enhanced via iAgent)
- **Memory & State** (Persistent context for strategy)

---

##  Features

- **Whatsapp / Telegram‑Native UX with other social platforms coming soon**  
  Launch and manage agents directly from your favorite chat app.
- **Auto Wallet Creation**  
  A dedicated Injective wallet is generated for every agent you create.
- **Natural Language Execution**  
  example prompts"Send 0.01 INJ to inj1..." or "Swap 1 USDT to INJ".
- **Rule-Based & AI Hybrid**  
  Uses a rule-based regex parser for fast, reliable common commands, falling back to a fine-tuned LLM prompt for complex reasoning.
- **Direct Chain Execution**  
  Low-latency broadcasting using the iAgent SDK.

---

##  Command Reference

| Command | Description |
|---------|-------------|
| `/start` | Dashboard for your active agent or prompt to create one. |
| `/account` | View your agent's Injective/EVM addresses and balances. |
| `/createagent` | Launch the wizard to create a new agent (Name + Persona). |
| `/myagents` | List all your agents and their current status. |
| `/switchagent` | Quick-switch between different active agents. |
| `🚰 Faucet` | (Inside `/account`) Receive test tokens for the Injective Testnet. |

---

##  Launching Your First Agent

When you run `/createagent`, you'll be asked for a **Name** and a **Persona**. In Zenji, your **Persona** *is* your **Strategy**. It defines the agent's risk appetite, trading style, and decision-making logic.

### 📑 Agent Profile Template (Persona/Strategy)

To get the best out of your agent, you can try the persona using this template:

1.  **Agent Name:** (e.g., Alpha Hunter, Calm Liquidity Maker)
2.  **Trading Personality:**
      -   **Risk Level:** Low / Medium / High
      -   **Style:** Trend-following, Mean-reversion, Market-making, Scalping, Portfolio rebalancing
      -   **Time Horizon:** Intra-day, Swing (days), Long-term
  i.  **Markets to Focus On:** (e.g., INJ/USDT Spot, INJ/USDT Perp)
  ii. **Position Sizing Rules:**
      -   Max % of total balance per position: e.g., 5%
      -   Max total exposure: e.g., 30% of account
      -   Max leverage: e.g., 3x
  iii. **Entry Rules (Plain Language):** (e.g., "Go long when price is above 50 EMA and breaks recent highs.")
  iv. **Exit & Risk Rules:**
      -   Stop-loss: e.g., 2% per trade | Take-profit: e.g., 4% per trade
      -   Daily Max Loss: e.g., 3% of balance (stop trading if hit)
  v.  **Behavior & Notifications:** (e.g., "Send updates after each trade and every hour.")
  vi. **Things This Agent Must NOT Do:** (e.g., "Never use leverage above 3x.")

---

##  Categorized Examples (Persona vs. Prompts)

### 1. Agent Setup: Personas & Strategies
Use these when creating your agent's identity via `/createagent`.

| Level | Example Persona / Strategy |
|:---|:---|
| **Beginner** | "A helpful and friendly assistant who loves the Injective ecosystem. Your goal is to help me learn about INJ and occasionally suggest small, low-risk swaps. You are conservative and always ask for confirmation." |
| **Pro** | "A disciplined trend-following trader. Focus on INJ/USDT spot. Risk level is medium. You enter long positions when the price breaks above the 20-day high. You always set a 2% stop-loss and a 5% take-profit. Notify me immediately after any trade." |
| **Experienced** | "A sophisticated market-maker and arbitrageur. Your strategy is to provide liquidity on INJ/USDT with a tight 0.3% spread. You monitor the RSI and only trade when it's between 30 and 70. Max leverage is 2x. If the daily loss exceeds 2% of the total balance, stop all trading immediately for 24 hours." |

### 2. User Interaction: Prompts
Use these when chatting with your active agent.

| Level | Example Prompts |
|:---|:---|
| **Beginner** | • "What's my current balance?"<br>• "Send 0.5 INJ to inj1abc..."<br>• "Swap 10 USDT for INJ." |
| **Pro** | • "Is now a good time to buy INJ based on the 4h chart?"<br>• "Swap 100 USDT for INJ if the price dips below $30."<br>• "Generate a report of my trading performance this week." |
| **Experienced** | • "Execute a mean-reversion trade if the RSI drops below 25 on the 15m timeframe."<br>• "Start market-making with a 0.5% spread and 100 USDT depth."<br>• "Rebalance my portfolio to 70/30 INJ/USDT if the deviation exceeds 5%." |

---

##  Getting Started

### 1. Installation
```bash
git clone https://github.com/FadhilMulinya/Zenji.git
cd Zenji
npm install
```

### 2. Configuration (`.env`)
```bash
cp .env.example .env
```
** set other variables as needed **

### 3. Running
```bash
npm run dev
```

---

##  Architecture

```
src/
├── controllers/      # Telegram/whatsapp  command handlers & callbacks
├── services/         # Business Logic (Agent, Injective, Wallet, Bank)
├── models/           # Mongoose Schemas (User, Agent, Wallet)
├── lib/              # environments, prompts, and utilities
└── characters/       # ElizaOS style character definition
└── database/         # Database connection and seeding
└── iagent/           # iagent core sdk and tools
    app.ts            # zenji Server starter
    
```

---

##  AI Models & Providers

Zenji is model‑agnostic. By default, it uses **Ollama** (`qwen2.5:3b`) for local execution and with ollama you dont need an api keys and your prompts are stored locally on your machine or your own server. You can switch to **OpenAI** or **Anthropic** in `agent.service.ts` to upgrade your agent's reasoning power.

*** I used ollama to build this project because i didnt have a paid api key for openai or anthropic. ***

---

##  Disclaimer

Zenji is an experimental hackathon project. Not financial tooling advice. Use at your own risk.

