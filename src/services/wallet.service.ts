import { PrivateKey, getEthereumAddress } from "@injectivelabs/sdk-ts";
import { encryptPrivateKey, encryptMnemonic } from "./crypto.service.ts";
import Wallet from "../models/Wallet.ts";
import { Types } from "mongoose";

export interface GeneratedInjectiveWallet {
  injectiveAddress: string;
  ethereumAddress: string;
  publicKeyHex: string;
  privateKeyHex: string;
  mnemonic?: string;
}

// ── Wallet generation helpers ──

export function generateInjectiveWallet(): GeneratedInjectiveWallet {
  const { mnemonic, privateKey } = PrivateKey.generate();
  return {
    ...walletFromPrivateKeyRaw(privateKey.toPrivateKeyHex()),
    mnemonic,
  };
}

export function walletFromMnemonic(mnemonic: string): GeneratedInjectiveWallet {
  const privateKey = PrivateKey.fromMnemonic(mnemonic);
  return {
    ...walletFromPrivateKeyRaw(privateKey.toPrivateKeyHex()),
    mnemonic,
  };
}

export function walletFromPrivateKeyRaw(privateKeyHex: string): GeneratedInjectiveWallet {
  const formattedKey = privateKeyHex.startsWith("0x") ? privateKeyHex : `0x${privateKeyHex}`;
  const privateKey = PrivateKey.fromPrivateKey(formattedKey);
  const injectiveAddress = privateKey.toBech32();
  const ethereumAddress = getEthereumAddress(injectiveAddress);
  const publicKeyHex = privateKey.toPublicKey().toHex();

  return {
    injectiveAddress,
    ethereumAddress,
    publicKeyHex,
    privateKeyHex: formattedKey,
  };
}

// ── Database operations (agent-centric) ──

const saveWallet = async (agentId: Types.ObjectId, walletData: GeneratedInjectiveWallet) => {
  const encryptedPrivateKey = encryptPrivateKey(walletData.privateKeyHex);
  const encryptedMnemonicVal = walletData.mnemonic ? encryptMnemonic(walletData.mnemonic) : undefined;

  const wallet = new Wallet({
    agent_id: agentId,
    injective_address: walletData.injectiveAddress,
    ethereum_address: walletData.ethereumAddress,
    public_key_hex: walletData.publicKeyHex,
    encrypted_private_key: encryptedPrivateKey,
    encrypted_mnemonic: encryptedMnemonicVal,
    network: "testnet",
  });

  return await wallet.save();
};

export const createWalletForAgent = async (agentId: Types.ObjectId) => {
  const walletData = generateInjectiveWallet();
  return await saveWallet(agentId, walletData);
};

export const importWalletFromMnemonic = async (agentId: Types.ObjectId, mnemonic: string) => {
  const walletData = walletFromMnemonic(mnemonic);
  return await saveWallet(agentId, walletData);
};

export const importWalletFromPrivateKey = async (agentId: Types.ObjectId, privateKeyHex: string) => {
  const walletData = walletFromPrivateKeyRaw(privateKeyHex);
  return await saveWallet(agentId, walletData);
};
