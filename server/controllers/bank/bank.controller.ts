import { ChainGrpcBankApi, MsgSend, MsgBroadcasterWithPk, PrivateKey } from "@injectivelabs/sdk-ts";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";
import axios from "axios";

const endpoints = getNetworkEndpoints(Network.Testnet);
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc);

const PRIMARY_FAUCET_URL = "https://jsbqfdd4yk.execute-api.us-east-1.amazonaws.com/v1/faucet";
const SECONDARY_FAUCET_URL = "https://testnet.faucet.injective.network/api/faucet";

export const getBalances = async (address: string) => {
  const response = await chainGrpcBankApi.fetchBalances(address);
  return response.balances;
};

export const receiveFaucet = async (address: string) => {
  console.log(`[FAUCET] Requesting tokens for: ${address}`);
  
  try {
    console.log(`[FAUCET] Trying primary: ${PRIMARY_FAUCET_URL}`);
    const response = await axios.post(PRIMARY_FAUCET_URL, { address });
    console.log(`[FAUCET] Primary Success:`, response.data);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const data = error.response?.data;
    console.warn(`[FAUCET] Primary failed (Status: ${status}, Message: ${JSON.stringify(data) || error.message}). Trying secondary...`);
    
    try {
      console.log(`[FAUCET] Trying secondary: ${SECONDARY_FAUCET_URL}`);
      const response = await axios.post(SECONDARY_FAUCET_URL, { address });
      console.log(`[FAUCET] Secondary Success:`, response.data);
      return response.data;
    } catch (secError: any) {
      console.error(`[FAUCET] All faucets failed.`);
      throw secError;
    }
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
