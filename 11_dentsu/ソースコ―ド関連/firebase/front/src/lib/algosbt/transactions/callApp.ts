import algosdk from 'algosdk';

import signSendWaitTxn from './signSendWaitTxn';

type TxnParams = {
  from: string;
  appIndex: number;
  appArgs: Uint8Array[] | undefined;
};

const callApp = async (
  algod: algosdk.Algodv2,
  { from, appIndex, appArgs }: TxnParams,
  secretKey: Uint8Array
) => {
  const suggestedParams = await algod.getTransactionParams().do();

  const txn = algosdk.makeApplicationNoOpTxnFromObject({
    from,
    suggestedParams,
    appIndex,
    appArgs,
  });

  await signSendWaitTxn(algod, txn, secretKey);
};

export default callApp;
