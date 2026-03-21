import { PrivateKey, getEthereumAddress } from '@injectivelabs/sdk-ts';

export interface GeneratedInjectiveWallet {
  injectiveAddress: string;   // inj1...
  ethereumAddress: string;    // 0x...
  publicKeyHex: string;       // hex-encoded pubkey bytes
  privateKeyHex: string;      // 64-char hex (secp256k1)
  mnemonic?: string;
}

/**
 * Generate a new Injective wallet and return details including mnemonic.
 */
export function generateInjectiveWallet(): GeneratedInjectiveWallet {
  const { mnemonic, privateKey } = PrivateKey.generate();
  return {
    ...walletFromPrivateKey(privateKey.toPrivateKeyHex()),
    mnemonic,
  };
}

/**
 * Derive wallet details from a mnemonic.
 */
export function walletFromMnemonic(mnemonic: string): GeneratedInjectiveWallet {
  const privateKey = PrivateKey.fromMnemonic(mnemonic);
  return {
    ...walletFromPrivateKey(privateKey.toPrivateKeyHex()),
    mnemonic,
  };
}

/**
 * Given a private key (hex), derive wallet details.
 */
export function walletFromPrivateKey(privateKeyHex: string): GeneratedInjectiveWallet {
  // Use fromPrivateKey instead of fromHex for better ethers v6 compatibility (requires 0x prefix if not present)
  const formattedKey = privateKeyHex.startsWith('0x') ? privateKeyHex : `0x${privateKeyHex}`;
  const privateKey = PrivateKey.fromPrivateKey(formattedKey);
  const injectiveAddress = privateKey.toBech32();
  const ethereumAddress = getEthereumAddress(injectiveAddress);

  const publicKeyHex = privateKey.toPublicKey().toHex();

  return {
    injectiveAddress,
    ethereumAddress,
    publicKeyHex,
    privateKeyHex: formattedKey, // Always return with 0x prefix for consistency
  };
}



