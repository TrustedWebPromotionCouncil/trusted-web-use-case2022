import algosdk from 'algosdk';

import searchForTransactions from '../indexer/searchForTransactions';

const loadMessage = async (indexer: algosdk.Indexer, assetIndex: number) => {
  const txns = await searchForTransactions(indexer, assetIndex);
  const buffers: Buffer[] = [];

  txns.forEach((txn) => {
    if (
      txn['tx-type'] === 'axfer' &&
      txn.note &&
      txn.group &&
      txn['asset-transfer-transaction']
    ) {
      const axferTxn = txn['asset-transfer-transaction'];

      if (axferTxn.amount === 0 && axferTxn.sender === axferTxn.receiver) {
        buffers.push(Buffer.from(txn.note, 'base64'));
      }
    }
  });

  return Uint8Array.from(Buffer.concat(buffers));
};
export default loadMessage;
