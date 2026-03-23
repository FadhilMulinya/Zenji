import {
  ChainGrpcBankApi,
  MsgSend,
  MsgBroadcasterWithPk,
  PrivateKey,
  MsgCreateSpotMarketOrder,
  spotPriceToChainPriceToFixed,
  spotQuantityToChainQuantityToFixed,
  getDefaultSubaccountId,
  IndexerGrpcSpotApi,
  spotPriceFromChainPriceToFixed,
} from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const network = process.env.INJECTIVE_NETWORK?.toLowerCase() === "mainnet"
  ? Network.MainnetK8s
  : Network.Testnet;

const endpoints = getNetworkEndpoints(network);
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc);
const indexerSpotApi = new IndexerGrpcSpotApi(endpoints.indexer);


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
    const fetchPromise = chainGrpcBankApi.fetchBalances(address);
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Injective Network gRPC timeout: fetchBalances took too long")), 15000));
    const response = await Promise.race([fetchPromise, timeoutPromise]) as any;
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

    const broadcastPromise = new MsgBroadcasterWithPk({ privateKey, network }).broadcast({
      msgs: msg,
    });
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Injective Network RPC timeout: broadcast took too long")), 30000));
    const response = await Promise.race([broadcastPromise, timeoutPromise]) as any;
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

    // Fetch live mid-price from the Injective indexer orderbook so
    // 'swap X USDT to INJ' actually spends X USDT worth of INJ.
    // Falls back to 15 USDT/INJ if the orderbook fetch fails.
    let livePricePerInj = 15;
    try {
      const fetchPromise = indexerSpotApi.fetchOrderbookV2(marketId);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Injective Network gRPC timeout: fetchOrderbook took too long")), 15000));
      const orderbook = await Promise.race([fetchPromise, timeoutPromise]) as any;
      const bestAsk = orderbook.sells?.[0]?.price;
      const bestBid = orderbook.buys?.[0]?.price;
      const toNum = (chainPrice: string) => parseFloat(
        spotPriceFromChainPriceToFixed({ value: chainPrice, baseDecimals: 18, quoteDecimals: 6 })
      );
      if (bestAsk && bestBid) {
        livePricePerInj = (toNum(bestAsk) + toNum(bestBid)) / 2;
      } else if (bestAsk) {
        livePricePerInj = toNum(bestAsk);
      } else if (bestBid) {
        livePricePerInj = toNum(bestBid);
      }
    } catch (priceErr) {
      console.warn(`[swapTokens] Live price fetch failed, using fallback ${livePricePerInj}: ${priceErr}`);
    }

    // BUY (USDT→INJ): amount = USDT to spend → injQuantity = usdtAmount / price
    // SELL (INJ→USDT): amount = INJ to sell → use directly
    let injQuantity = isBuy ? amount / livePricePerInj : amount;

    // The INJ/USDT market requires quantities in increments of 0.001 INJ (minQuantityTickSize).
    // We strictly truncate to 3 decimal places to prevent "The quantity is not valid" errors.
    injQuantity = Math.floor(injQuantity * 1000) / 1000;

    if (injQuantity <= 0) {
      throw new Error("Calculated quantity is too small to trade (minimum 0.001 INJ).");
    }

    // Cap/floor price must be a whole number to satisfy Injective's tick-size constraints.
    // We use ceil/floor with +10% / -10% buffer around live price.
    // Math: reserve_cost = injQuantity * cap = (amount/price) * (price*1.1) = amount*1.1
    // So the locked balance is always ~1.1x the amount the user wants to spend.
    const worseCasePrice = isBuy
      ? Math.ceil(livePricePerInj * 1.1)   // round UP to nearest int (buy cap)
      : Math.max(1, Math.floor(livePricePerInj * 0.9)); // round DOWN to nearest int, min 1 (sell floor)

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

    const broadcastPromise = new MsgBroadcasterWithPk({ privateKey, network }).broadcast({
      msgs: msg,
    });
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Injective Network RPC timeout: broadcast took too long")), 30000));
    const response = await Promise.race([broadcastPromise, timeoutPromise]) as any;

    return response.txHash;
  }
}
