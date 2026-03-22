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

    const amountChain = (amountNum * Math.pow(10, decimals)).toLocaleString('fullwide', {useGrouping:false});

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

  static async swapTokens(privateKeyHex: string, fromToken: string, toToken: string, quantityOfInj: number) {
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
        : "0xa508cb329233ce71527f1c4e90d1870e4702bba689f9296ddce50284ab9fb8b1"; // Mainnet ID

    const market = {
        marketId,
        baseDecimals: 18,
        quoteDecimals: 6
    };

    // To guarantee market order fill, we use a slippage-tolerant price
    // Buy INJ: specify a high max price (e.g. 100 USDT)
    // Sell INJ: specify a low min price (e.g. 0.1 USDT)
    const price = isBuy ? 100 : 0.001; 

    // quantityOfInj is ALWAYS the amount of INJ to buy or sell (base asset)
    const msg = MsgCreateSpotMarketOrder.fromJSON({
      subaccountId: injectiveAddress + "000000000000000000000000",
      injectiveAddress,
      orderType: isBuy ? 1 : 2, // 1 is buy, 2 is sell
      price: spotPriceToChainPriceToFixed({
        value: price,
        baseDecimals: market.baseDecimals,
        quoteDecimals: market.quoteDecimals,
      }),
      quantity: spotQuantityToChainQuantityToFixed({
        value: quantityOfInj,
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
