import algosdk from 'algosdk';

import signSendWaitTxn from './signSendWaitTxn';

type TxnParams = {
  from: string;
  assetIndex: number;
};

const removeClawback = async (
  algod: algosdk.Algodv2,
  { from, assetIndex }: TxnParams,
  secretKey: Uint8Array
) => {
  const suggestedParams = await algod.getTransactionParams().do();

  const txn = algosdk.makeAssetConfigTxnWithSuggestedParamsFromObject({
    from,
    assetIndex,
    manager: from,
    strictEmptyAddressChecking: false,
    suggestedParams,
  });

  await signSendWaitTxn(algod, txn, secretKey);
};

export default removeClawback;
