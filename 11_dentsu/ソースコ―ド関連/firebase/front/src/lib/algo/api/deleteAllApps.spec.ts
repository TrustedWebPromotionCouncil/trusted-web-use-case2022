import { describe, it, expect } from 'vitest';

import createRevokedApp from './createRevokedApp';
import deleteApp from './deleteApp';

import { testNetAlgod as algod } from '../algod/algods';
import { testNetAlgoIndexer as indexer } from '../indexer/indexers';
import { test2Account } from '../account/secrets';

import deleteAllApps, { getAppIndexes } from './deleteAllApps';

describe('deleteAllApps', () => {
  it('getAppIndexes should work', async () => {
    const appIndex = await createRevokedApp(algod, test2Account.sk);

    try {
      expect(await getAppIndexes(indexer, test2Account.addr)).to.include(
        appIndex
      );
    } finally {
      await deleteApp(algod, appIndex, test2Account.sk);
    }
  });

  it('deleteAllApps should work', async () => {
    const appIndex = await createRevokedApp(algod, test2Account.sk);

    try {
      expect((await getAppIndexes(indexer, test2Account.addr)).length).to.be.gt(
        0
      );

      await deleteAllApps(indexer, algod, test2Account.sk);

      expect((await getAppIndexes(indexer, test2Account.addr)).length).to.eq(0);
    } finally {
      const appIndexes = await getAppIndexes(indexer, test2Account.addr);

      if (appIndexes.indexOf(appIndex) >= 0) {
        await deleteApp(algod, appIndex, test2Account.sk);
      }
    }
  });
});
