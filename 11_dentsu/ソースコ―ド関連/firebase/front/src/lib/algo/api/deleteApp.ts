import * as algosdk from 'algosdk';

import signSendWaitTxn from './signSendWaitTxn';

const deleteApp = async (
  algod: algosdk.Algodv2,
  appIndex: number,
  secretKey: Uint8Array
) => {
  const suggestedParams = await algod.getTransactionParams().do();

  const txn = algosdk.makeApplicationDeleteTxnFromObject({
    from: algosdk.encodeAddress(secretKey.slice(32)),
    suggestedParams,
    appIndex,
  });

  await signSendWaitTxn(algod, txn, secretKey);
};

export default deleteApp;
