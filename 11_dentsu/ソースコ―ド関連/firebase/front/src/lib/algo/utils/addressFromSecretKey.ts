import * as algosdk from 'algosdk';

export const addressFromSecretKey = (secretKey: Uint8Array): string => {
  return algosdk.encodeAddress(secretKey.slice(32));
};

export default addressFromSecretKey;
