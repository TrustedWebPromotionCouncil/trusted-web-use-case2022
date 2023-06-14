import algosdk from 'algosdk';

export const getAppIndexes = async (
  indexer: algosdk.Indexer,
  address: string
) => {
  const ret = await indexer.lookupAccountCreatedApplications(address).do();
  const appIndexes: number[] = ret.applications.map((app: any) => {
    return app.id;
  });

  return appIndexes;
};

export const deleteAllApps = async (
  indexer: algosdk.Indexer,
  algod: algosdk.Algodv2,
  secretKey: Uint8Array
) => {
  const address = algosdk.encodeAddress(secretKey.slice(32));
  const suggestedParams = await algod.getTransactionParams().do();
  const txns: algosdk.Transaction[] = [];
  const appIndexes = await getAppIndexes(indexer, address);

  if (appIndexes.length == 0) {
    return;
  }

  console.log('Delete all applications:', appIndexes);

  appIndexes.forEach((appIndex) => {
    const txn = algosdk.makeApplicationDeleteTxnFromObject({
      from: address,
      appIndex,
      suggestedParams,
    });

    txns.push(txn);
  });

  algosdk.assignGroupID(txns);

  const stxns: Uint8Array[] = [];

  txns.forEach((txn) => {
    stxns.push(txn.signTxn(secretKey));
  });

  const txResult = await algod.sendRawTransaction(stxns).do();
  await algosdk.waitForConfirmation(algod, txResult.txId, 10);
};

export default deleteAllApps;
