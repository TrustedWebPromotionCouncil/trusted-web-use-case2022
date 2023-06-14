import algosdk from 'algosdk';

import callApp from './callApp';

export type TxnParams = {
  appIndex: number;
  value: number;
};

const setRevoked = async (
  algod: algosdk.Algodv2,
  { appIndex, value }: TxnParams,
  secretKey: Uint8Array
) => {
  const appArgs = [
    new TextEncoder().encode('set_revoked'),
    algosdk.encodeUint64(value),
  ];

  await callApp(algod, { appIndex, appArgs }, secretKey);
};

export default setRevoked;
