import algosdk from 'algosdk';

import makeNoteTxn from './makeNoteTxn';
import sendWaitTxn from './sendWaitTxn';

type TxnParams = {
  from: string;
  assetIndex: number;
  notes: Uint8Array[];
};

const saveBatchNotes = async (
  algod: algosdk.Algodv2,
  { from, assetIndex, notes }: TxnParams,
  secretKey: Uint8Array
) => {
  const suggestedParams = await algod.getTransactionParams().do();
  const txns: algosdk.Transaction[] = [];

  notes.forEach((note) => {
    const txn = makeNoteTxn({ from, assetIndex, note, suggestedParams });
    txns.push(txn);
  });

  algosdk.assignGroupID(txns);

  const signedTxns: Uint8Array[] = [];

  txns.forEach((txn) => {
    signedTxns.push(txn.signTxn(secretKey));
  });

  await sendWaitTxn(algod, signedTxns);
};

export default saveBatchNotes;
