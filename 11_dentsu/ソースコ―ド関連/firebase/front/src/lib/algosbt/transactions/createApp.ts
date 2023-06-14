import * as algosdk from 'algosdk';

import signSendWaitTxn from './signSendWaitTxn';

export type TxnParams = {
  from: string;
  approvalProgram: Uint8Array;
  clearProgram: Uint8Array;
  numLocalInts: number;
  numLocalByteSlices: number;
  numGlobalInts: number;
  numGlobalByteSlices: number;
};

const createApp = async (
  algod: algosdk.Algodv2,
  {
    from,
    approvalProgram,
    clearProgram,
    numLocalInts,
    numLocalByteSlices,
    numGlobalInts,
    numGlobalByteSlices,
  }: TxnParams,
  secretKey: Uint8Array
) => {
  const suggestedParams = await algod.getTransactionParams().do();
  const onComplete = algosdk.OnApplicationComplete.NoOpOC;

  const txn = algosdk.makeApplicationCreateTxnFromObject({
    from,
    suggestedParams,
    onComplete,
    approvalProgram,
    clearProgram,
    numLocalInts,
    numLocalByteSlices,
    numGlobalInts,
    numGlobalByteSlices,
  });

  const ctx = await signSendWaitTxn(algod, txn, secretKey);

  return ctx['application-index'];
};

export default createApp;
