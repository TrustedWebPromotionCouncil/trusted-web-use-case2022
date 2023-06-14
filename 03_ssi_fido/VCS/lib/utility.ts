import { Coder } from "@stablelib/base64";

/**
 * Encodes a Uint8Array to a base64 string
 * @param bytes Input Uin8Array
 */
export const base64Encode = (bytes: Uint8Array): string => {
  const coder = new Coder();
  return coder.encode(bytes);
};
/**
 * Decodes a base64 string to a Uint8Array
 * @param bytes Input base64 string
 */

export const base64Decode = (string: string): Uint8Array => {
  const coder = new Coder();
  return coder.decode(string);
};

/**
 * Converts a UTF-8 Encoded string to a byte array
 * @param string
 */
export const stringToBytes = (string: string): Uint8Array =>
  Uint8Array.from(Buffer.from(string, "utf-8"));