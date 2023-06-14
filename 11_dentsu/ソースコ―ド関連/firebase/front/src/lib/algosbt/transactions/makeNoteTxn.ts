import algosdk from 'algosdk';

type TxnParams = {
  from: string;
  assetIndex: number;
  note: Uint8Array;
  suggestedParams: algosdk.SuggestedParams;
};

const makeNoteTxn = ({
  from,
  assetIndex,
  note,
  suggestedParams,
}: TxnParams) => {
  return algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from,
    to: from,
    revocationTarget: from,
    amount: 0,
    assetIndex,
    note,
    suggestedParams,
  });
};

export default makeNoteTxn;
