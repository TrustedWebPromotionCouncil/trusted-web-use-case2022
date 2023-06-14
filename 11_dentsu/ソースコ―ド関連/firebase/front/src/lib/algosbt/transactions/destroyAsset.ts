import algosdk from 'algosdk';

import { test1Account } from '../account/accounts';
import { testNetAlgod } from '../algod/algods';

import signSendWaitTxn from './signSendWaitTxn';

const destroyAsset = async (
  algod: algosdk.Algodv2,
  txnParams: { from: string; assetIndex: number },
  secretKey: Uint8Array
) => {
  const { from, assetIndex } = txnParams;
  const suggestedParams = await algod.getTransactionParams().do();

  const txn = algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
    from,
    assetIndex,
    suggestedParams,
  });

  await signSendWaitTxn(algod, txn, secretKey);
};

const main = async () => {
  if (process.argv.length != 3) {
    console.warn(
      'Usage: yarn ts-node src/lib/algosbt/asset/destroyAsset.ts assetIndex'
    );
    process.exit(1);
  }

  const assetIndex = Number(process.argv[2]);

  await destroyAsset(
    testNetAlgod,
    { from: test1Account.addr, assetIndex },
    test1Account.sk
  );
};

if (require.main === module) {
  (async () => {
    await main();
    process.exit(0);
  })().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

export default destroyAsset;
