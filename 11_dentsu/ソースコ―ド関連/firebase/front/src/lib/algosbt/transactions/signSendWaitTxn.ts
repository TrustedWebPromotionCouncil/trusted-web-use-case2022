import algosdk from 'algosdk';

import sendWaitTxn from './sendWaitTxn';

const signSendWaitTxn = async (
  algod: algosdk.Algodv2,
  txn: algosdk.Transaction,
  secretKey: Uint8Array
) => {
  const stxn = txn.signTxn(secretKey);

  return sendWaitTxn(algod, stxn);
};

export default signSendWaitTxn;
