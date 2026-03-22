# Zenji – Telegram‑Native AI Trading Agent on Injective

Zenji is a Telegram‑first AI trading agent that lets anyone create and run automated trading bots on **Injective** just by chatting in natural language.  
On first contact, Zenji creates a dedicated Injective wallet for the user and then uses AI + **Injective Trader** to translate free‑form strategy descriptions into live on‑chain bots. [web:3][web:6][web:39][web:59]

---

## ✨ What Zenji Does

- **Telegram‑native UX**  
  Start from a simple `/start` command in Telegram. No prior DeFi or coding experience required.

- **Auto wallet creation**  
  The first time a user talks to Zenji, it generates an Injective wallet address for that Telegram account (MVP: demo/custodial, post‑MVP: social‑login, non‑custodial). [web:16][web:40]

- **Natural‑language strategies**  
  Users describe what they want in plain English (e.g. *"market‑make INJ/USDT with 0.5% spread, 50 USDT per order, stop at 20 USDT loss"*), and Zenji converts that into a structured strategy config. [web:3][web:22]

- **On‑chain execution via Injective Trader**  
  Zenji hands configs to **Injective Trader**, which manages order placement, risk, and monitoring on the Injective chain. [web:6][web:9]

- **Live control & notifications**  
  Users can launch, pause, and update bots from Telegram and receive PnL and risk alerts in chat.

---

## How to run the application
```
clone the repo  git@github.com:FadhilMulinya/Zenji.git
```

```
npm install
```

```
cp .env.example .env
```

```
make sure you have an api key if not run a local model
```

## 🧠 Architecture Overview

**Core pieces:**

- **Telegram Bot Service**  
  Handles `/start`, `/strategy`, `/status`, and plain‑text messages using the Telegram Bot API. [web:27][web:35]

- **Zenji Backend**  
  - User & wallet service  
  - AI strategy service (built on Injective’s iAgent ideas) [web:3][web:22]  
  - Bot orchestration service (interface to Injective Trader) [web:6][web:9]  
  - Market data integration via Injective public APIs [web:39][web:59][web:61]

- **Injective Trader**  
  Execution engine for automated strategies (market‑making, etc.). [web:6]

- **Injective Network**  
  DeFi‑optimized L1 with on‑chain orderbook and low‑latency APIs. [web:57][web:59]

- **(Optional) Web Dashboard**  
  A lightweight SPA for viewing bots, PnL, and positions.

---

## 🏗 MVP Flow

1. **User runs `/start` in Telegram**  
   - Backend ensures a `User` + Injective `Wallet` exist for the `telegram_user_id`.  
   - If not, it generates a new Injective keypair (MVP) and funds it from a testnet account. [web:39]

2. **User describes strategy**  
   - Example:  
     > "Run a market‑making bot on INJ/USDT with 0.5% spread, 50 USDT per order, max 200 USDT inventory, stop at 20 USDT daily loss."

3. **AI strategy config**  
   - Zenji turns the prompt into a JSON config:  
     ```json
     {
       "market_id": "inj-usdt",
       "spread_bps": 50,
       "order_size": 50,
       "max_position": 200,
       "max_daily_loss": 20
     }
     ```  
   - User receives a summary in Telegram and confirms.

4. **Bot launch via Injective Trader**  
   - Backend writes the config and starts a strategy instance using Injective Trader. [web:6][web:9]

5. **Monitoring & control**  
   - Zenji polls Injective APIs for PnL, exposure, and trades. [web:7][web:39]  
   - Users manage bots with Telegram commands (`/status`, `/pause`, `/stop`) or plain text.

---

## 🧩 Data Model (Simplified)

- **User**
  - `id`
  - `telegram_user_id`
  - `created_at`

- **Wallet**
  - `id`
  - `user_id`
  - `injective_address`
  - `encrypted_private_key` (MVP only)
  - `network`
  - `created_at`

- **Strategy**
  - `id`
  - `user_id`
  - `wallet_id`
  - `raw_prompt`
  - `config_json`
  - `status` (draft/running/paused/stopped)
  - `created_at`, `updated_at`

- **BotRun**
  - `id`
  - `strategy_id`
  - `start_time`, `stop_time`
  - `final_pnl`
  - `meta`

---

## 🔌 REST API (MVP)

### User & session

- `POST /api/user/ensure`  
  - Input: `{ telegram_id }`  
  - Output: `{ user_id, injective_address }`

- `POST /api/session/create`  
  - Input: `{ telegram_id }`  
  - Output: `{ session_token }`

- `GET /api/session/me`  
  - Auth: Bearer session_token  
  - Output: `{ user_id, injective_address }`

### Strategy

- `POST /api/strategy/from-prompt`  
  - Input: `{ telegram_id, prompt, market_hint? }`  
  - Output: `{ strategy_id, summary, config }`

- `GET /api/strategy/:id`  
  - Output: strategy object

- `GET /api/strategy?user_id=...`  
  - Output: list of strategies

### Bots

- `POST /api/bot/start`  
  - Input: `{ strategy_id }`  
  - Output: `{ run_id, status }`

- `POST /api/bot/stop`  
  - Input: `{ strategy_id | run_id }`  
  - Output: `{ status }`

- `GET /api/bot/status?user_id=...`  
  - Output: PnL, exposure, state, etc.

- `POST /api/bot/update-config`  
  - Input: `{ strategy_id, changes }`  
  - Output: updated config

### Markets

- `GET /api/markets`  
- `GET /api/markets/:id/summary`  

Both proxy Injective public APIs. [web:7][web:39][web:61]

---

## 🧪 Local Dev / Demo

1. Run Injective Trader connected to Injective testnet. [web:6][web:39]  
2. Deploy the Zenji backend and configure Injective RPC/indexer endpoints. [web:39][web:61]  
3. Set up a Telegram bot via BotFather, point webhook to your backend. [web:27][web:35]  
4. Start the web dashboard (optional) and open the demo account.

---

## 🛣 Roadmap

- Replace custodial wallets with non‑custodial Web3Auth/Torus login. [web:16][web:40]  
- Add new strategy templates (trend‑following, hedging, etc.).  
- Integrate WhatsApp and X/Twitter as additional chat surfaces.  
- Explore multi‑agent risk managers and cross‑chain hedging using iAgent 2.0 + CLI skills. [web:3][web:63]

---

## ⚠️ Disclaimer

Zenji is an experimental hackathon project.  
This repo and associated bots are **not** production‑ready and **do not** constitute financial advice.

