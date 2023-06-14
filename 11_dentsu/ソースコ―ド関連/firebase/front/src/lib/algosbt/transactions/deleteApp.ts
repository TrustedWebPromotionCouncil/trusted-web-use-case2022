import * as algosdk from 'algosdk';

import signSendWaitTxn from './signSendWaitTxn';

type TxnParams = {
  from: string;
  appIndex: number;
};

const deleteApp = async (
  algod: algosdk.Algodv2,
  { from, appIndex }: TxnParams,
  secretKey: Uint8Array
) => {
  const suggestedParams = await algod.getTransactionParams().do();

  const txn = algosdk.makeApplicationDeleteTxnFromObject({
    from,
    suggestedParams,
    appIndex,
  });

  await signSendWaitTxn(algod, txn, secretKey);
};

export default deleteApp;
