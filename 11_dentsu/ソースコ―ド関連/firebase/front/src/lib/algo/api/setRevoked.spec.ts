import { describe, it, expect } from 'vitest';

import { test1Account } from '../account/secrets';
import { testNetAlgod as algod } from '../algod/algods';
import getGlobalState from './getGlobalState';

import createRevokedApp from './createRevokedApp';
import deleteApp from './deleteApp';
import setRevoked from './setRevoked';

describe('setRevoked', () => {
  it('should work', async () => {
    const appIndex = await createRevokedApp(algod, test1Account.sk);

    try {
      console.log('Application Index:', appIndex);

      const state = await getGlobalState(algod, appIndex);

      expect(state.revoked).toEqual(0);

      await setRevoked(algod, { appIndex, value: 1 }, test1Account.sk);

      const state2 = await getGlobalState(algod, appIndex);

      expect(state2.revoked).toEqual(1);
    } finally {
      await deleteApp(algod, appIndex, test1Account.sk);
    }
  });
});
