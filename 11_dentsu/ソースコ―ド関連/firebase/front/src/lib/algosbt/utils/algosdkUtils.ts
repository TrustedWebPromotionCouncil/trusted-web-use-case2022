import algosdk from 'algosdk';

import { publicKeyFromSecretKey } from './naclUtils';

export const addressFromSecretKey = (secretKey: Uint8Array) => {
  const publicKey = publicKeyFromSecretKey(secretKey);

  return algosdk.encodeAddress(publicKey);
};
