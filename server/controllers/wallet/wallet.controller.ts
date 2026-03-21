import { PrivateKey } from '@injectivelabs/sdk-ts';
import { randomBytes } from 'crypto';

/**
 * Generate a new Injective wallet locally.
 * Returns the bech32 address and raw private key (hex).
 */
export function generateInjectiveWallet() {
  // 32 bytes secp256k1 private key
  const privKeyBytes = randomBytes(32);
  const privKeyHex = privKeyBytes.toString('hex');

  // Create PrivateKey instance
  const privateKey = PrivateKey.fromHex(privKeyHex); // [web:82][web:86]

  // Derive Injective address
  const injectiveAddress = privateKey.toBech32(); // inj1... [web:86][web:87]
  console.log(`injectiveAddress: ${injectiveAddress}, privKeyHex: ${privKeyHex}, privateKey: ${privateKey}`);

  return {
    injectiveAddress,
    privKeyHex
  };
}

generateInjectiveWallet()