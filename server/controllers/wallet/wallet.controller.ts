import { generateInjectiveWallet, walletFromMnemonic, walletFromPrivateKey, GeneratedInjectiveWallet } from "../../lib/wallet";
import { encryptPrivateKey, encryptMnemonic } from "../../lib/crypto";
import Wallet from "../../models/Wallet";
import { Types } from "mongoose";

export const createNewWallet = async (userId: Types.ObjectId) => {
  const walletData = generateInjectiveWallet();
  return await saveWallet(userId, walletData);
};

export const importWalletFromMnemonic = async (userId: Types.ObjectId, mnemonic: string) => {
  const walletData = walletFromMnemonic(mnemonic);
  return await saveWallet(userId, walletData);
};

export const importWalletFromPrivateKey = async (userId: Types.ObjectId, privateKeyHex: string) => {
  const walletData = walletFromPrivateKey(privateKeyHex);
  return await saveWallet(userId, walletData);
};

const saveWallet = async (userId: Types.ObjectId, walletData: GeneratedInjectiveWallet) => {
  const encryptedPrivateKey = encryptPrivateKey(walletData.privateKeyHex);
  const encryptedMnemonic = walletData.mnemonic ? encryptMnemonic(walletData.mnemonic) : undefined;

  const wallet = new Wallet({
    user_id: userId,
    injective_address: walletData.injectiveAddress,
    ethereum_address: walletData.ethereumAddress,
    public_key_hex: walletData.publicKeyHex,
    encrypted_private_key: encryptedPrivateKey,
    encrypted_mnemonic: encryptedMnemonic,
    network: "testnet",
  });

  return await wallet.save();
};
