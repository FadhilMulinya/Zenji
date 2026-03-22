import crypto from "crypto";
import { ENV } from "../lib/environments.ts";

const ALGORITHM = "aes-256-cbc";
const KEY = crypto.scryptSync(ENV.JWT_SECRET || "default_secret", "salt", 32);

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export const encryptPrivateKey = encrypt;
export const encryptMnemonic = encrypt;
export const decryptPrivateKey = decrypt;
export const decryptMnemonic = decrypt;
