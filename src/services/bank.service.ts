import { ChainGrpcBankApi, MsgSend, MsgBroadcasterWithPk, PrivateKey } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import axios from "axios";

const network = process.env.INJECTIVE_NETWORK?.toLowerCase() === "mainnet"
  ? Network.MainnetK8s
  : Network.Testnet;

const endpoints = getNetworkEndpoints(network);
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc);

const DENOM_DECIMALS: Record<string, number> = {
  inj: 18,
  "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7": 6, // USDT ERC-20 bridged
  "ibc/4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB": 6, // USDT native IBC
};

const DENOM_LABELS: Record<string, string> = {
  inj: "INJ",
  "peggy0xdAC17F958D2ee523a2206206994597C13D831ec7": "USDT (Peggy)",
  "ibc/4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB": "USDT (Native)",
};

export const getBalances = async (address: string) => {
  const response = await chainGrpcBankApi.fetchBalances(address);
  return response.balances;
};

export const formatBalances = (balances: any[]) => {
  if (!balances || balances.length === 0) return "No assets found.";
  return balances.map(bal => {
    const decimals = DENOM_DECIMALS[bal.denom] ?? 18;
    const amount = (parseFloat(bal.amount) / Math.pow(10, decimals)).toFixed(4);
    const label = DENOM_LABELS[bal.denom] || bal.denom.substring(0, 20) + "...";
    return `• ${amount} ${label}`;
  }).join("\n");
};

export const receiveFaucet = async (address: string) => {
  console.log(`[FAUCET] Requesting tokens for: ${address}`);
  
  // Latest official Testnet Faucet API from docs
  const FAUCET_API = "https://jsbqfdd4yk.execute-api.us-east-1.amazonaws.com/v1/faucet";

  try {
    console.log(`[FAUCET] Calling: ${FAUCET_API}`);
    const response = await axios.post(FAUCET_API, { address });
    console.log(`[FAUCET] Success:`, response.data);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.message || error.message;
    
    console.error(`[FAUCET] Failed (Status: ${status}): ${message}`);

    if (status === 403) {
        throw new Error("Faucet rate limited or blocked (403). Please try again later or use the web faucet: https://testnet.faucet.injective.network/");
    }
    
    if (status === 404) {
        throw new Error("Faucet API endpoint not found (404). The service might be undergoing maintenance.");
    }

    throw new Error(`Faucet error: ${message}`);
  }
};

export const sendAssets = async (privateKeyHex: string, toAddress: string, amount: string, denom: string = "inj") => {
  const privateKey = PrivateKey.fromPrivateKey(privateKeyHex);
  const srcInjectiveAddress = privateKey.toBech32();

  const msg = MsgSend.fromJSON({
    amount: {
      denom,
      amount,
    },
    srcInjectiveAddress,
    dstInjectiveAddress: toAddress,
  });

  const txHash = await new MsgBroadcasterWithPk({
    privateKey,
    network: Network.Testnet,
  }).broadcast({
    msgs: msg,
  });

  return txHash;
};
