import algosdk from 'algosdk';

import callApp from './callApp';

export type TxnParams = {
  from: string;
  appIndex: number;
  value: number;
};

const setRevoked = async (
  algod: algosdk.Algodv2,
  { from, appIndex, value }: TxnParams,
  secretKey: Uint8Array
) => {
  const appArgs = [
    new TextEncoder().encode('set_revoked'),
    algosdk.encodeUint64(value),
  ];

  await callApp(algod, { from, appIndex, appArgs }, secretKey);
};

export default setRevoked;
