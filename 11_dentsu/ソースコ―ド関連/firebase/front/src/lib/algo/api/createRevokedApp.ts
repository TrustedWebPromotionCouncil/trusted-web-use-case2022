import * as algosdk from 'algosdk';

import compile from './compile';
import approvalTeal from '../teal/revokedApproval.teal';
import clearTeal from '../teal/revokedClear.teal';

import createApp, { TxnParams } from './createApp';

const createRevokedApp = async (
  algod: algosdk.Algodv2,
  secretKey: Uint8Array
) => {
  const approvalProgram = await compile(algod, approvalTeal);
  const clearProgram = await compile(algod, clearTeal);
  const txnParams: TxnParams = {
    approvalProgram,
    clearProgram,
    numLocalInts: 0,
    numLocalByteSlices: 0,
    numGlobalInts: 1,
    numGlobalByteSlices: 0,
  };

  return createApp(algod, txnParams, secretKey);
};

export default createRevokedApp;
