import {
  ChainGrpcBankApi,
  MsgSend,
  MsgBroadcasterWithPk,
  PrivateKey,
  MsgCreateSpotMarketOrder,
  spotPriceToChainPriceToFixed,
  spotQuantityToChainQuantityToFixed
} from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import * as bech32Lib from "bech32";

/**
 * Derive the correct Injective default subaccount ID (index 0).
 * Format: ethereum_hex_without_0x (40 chars) + 24 zero chars = 64 hex chars total.
 * The bech32 address encodes the same 20-byte pubkey hash as the Ethereum address.
 */
function getDefaultSubaccountId(injectiveBech32: string): string {
  const { words } = bech32Lib.decode(injectiveBech32);
  const bytes = bech32Lib.fromWords(words); // 20-byte address
  const hexAddr = Buffer.from(bytes).toString("hex").toLowerCase().padStart(40, "0");
  return hexAddr + "000000000000000000000000"; // 40 + 24 = 64 hex chars (32 bytes)
}

const network = process.env.INJECTIVE_NETWORK?.toLowerCase() === "mainnet"
  ? Network.MainnetK8s
  : Network.Testnet;

const endpoints = getNetworkEndpoints(network);
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc);

const DENOM_DECIMALS: Record<string, number> = {
  inj: 18,
  "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5": 6, // USDT Testnet Peggy
  "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7": 6, // USDT Mainnet Peggy
};

const DENOM_LABELS: Record<string, string> = {
  inj: "INJ",
  "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5": "USDT",
  "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7": "USDT",
};

export class InjectiveService {

  static async getBalancesFormatted(address: string): Promise<string> {
    const response = await chainGrpcBankApi.fetchBalances(address);
    const balances = response.balances;

    if (!balances || balances.length === 0) {
      return "No balances found on-chain.";
    }

    return balances.map(bal => {
      const decimals = DENOM_DECIMALS[bal.denom] ?? 18;
      const amount = (parseFloat(bal.amount) / Math.pow(10, decimals)).toFixed(4);
      const label = DENOM_LABELS[bal.denom] || bal.denom;
      return `  ${label}: ${amount}`;
    }).join("\n");
  }

  static async sendTokens(privateKeyHex: string, toAddress: string, amountNum: number, denomLabel: string) {
    const privateKey = PrivateKey.fromPrivateKey(privateKeyHex);
    const srcInjectiveAddress = privateKey.toBech32();

    const isUSDT = denomLabel.toUpperCase() === "USDT";
    const denom = isUSDT
      ? (network === Network.Testnet ? "peggy0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5" : "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7")
      : "inj";
    const decimals = isUSDT ? 6 : 18;

    const amountChain = (amountNum * Math.pow(10, decimals)).toLocaleString('fullwide', { useGrouping: false });

    const msg = MsgSend.fromJSON({
      amount: { denom, amount: amountChain },
      srcInjectiveAddress,
      dstInjectiveAddress: toAddress,
    });

    const response = await new MsgBroadcasterWithPk({ privateKey, network }).broadcast({
      msgs: msg,
    });
    return response.txHash;
  }

  static async swapTokens(privateKeyHex: string, fromToken: string, toToken: string, amount: number) {
    const privateKey = PrivateKey.fromPrivateKey(privateKeyHex);
    const injectiveAddress = privateKey.toBech32();

    const isBuy = fromToken.toUpperCase() === "USDT" && toToken.toUpperCase() === "INJ";
    const isSell = fromToken.toUpperCase() === "INJ" && toToken.toUpperCase() === "USDT";

    if (!isBuy && !isSell) {
      throw new Error("Only INJ/USDT swaps are supported by this simplified action.");
    }

    // Spot Market ID for INJ/USDT
    const marketId = network === Network.Testnet
      ? "0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe"
      : "0xa508cb329233ce71527f1c4e90d1870e4702bba689f9296ddce50284ab9fb8b1";

    const market = {
      marketId,
      baseDecimals: 18,
      quoteDecimals: 6
    };

    // For a market BUY order (USDT → INJ):
    //   `amount` is the USDT the user wants to spend.
    //   The spot market needs a quantity in terms of the BASE asset (INJ).
    //   We use a conservative estimated price to derive INJ quantity:
    //   injQty = usdtAmount / estimatedPricePerInj
    //
    // For a market SELL order (INJ → USDT):
    //   `amount` is already the INJ to sell — use it directly.
    //
    // The order `price` is a cap/floor to guarantee fill:
    //   Buy cap  = 100 USDT/INJ  (will fill at whatever market price, up to 100)
    //   Sell floor = 0.001 USDT/INJ (will fill at whatever market price, above 0.001)

    const ESTIMATED_INJ_PRICE_USDT = 25; // conservative estimate; replace with live feed in future
    const injQuantity = isBuy
      ? amount / ESTIMATED_INJ_PRICE_USDT  // convert USDT spend → INJ quantity
      : amount;                             // already in INJ

    const worseCasePrice = isBuy ? 100 : 0.001;

    const msg = MsgCreateSpotMarketOrder.fromJSON({
      subaccountId: getDefaultSubaccountId(injectiveAddress),
      injectiveAddress,
      orderType: isBuy ? 1 : 2, // 1 = buy, 2 = sell
      price: spotPriceToChainPriceToFixed({
        value: worseCasePrice,
        baseDecimals: market.baseDecimals,
        quoteDecimals: market.quoteDecimals,
      }),
      quantity: spotQuantityToChainQuantityToFixed({
        value: injQuantity,
        baseDecimals: market.baseDecimals,
      }),
      marketId: market.marketId,
      feeRecipient: injectiveAddress,
    });

    const response = await new MsgBroadcasterWithPk({ privateKey, network }).broadcast({
      msgs: msg,
    });

    return response.txHash;
  }
}
