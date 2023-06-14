import 'dotenv/config';
import * as algosdk from 'algosdk';

export const holderPw = '12345678';
export const issuerPw = '23456789';
export const verifierPw = '34567812';

export const test1Account = algosdk.mnemonicToSecretKey(
  process.env.TEST1_MNEMONIC || ''
);
export const test2Account = algosdk.mnemonicToSecretKey(
  process.env.TEST2_MNEMONIC || ''
);
export const test3Account = algosdk.mnemonicToSecretKey(
  process.env.TEST3_MNEMONIC || ''
);
