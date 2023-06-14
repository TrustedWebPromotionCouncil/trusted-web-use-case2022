import { describe, it, expect } from 'vitest';

import { test1Account } from '../account/secrets';
import { testNetAlgod as algod } from '../algod/algods';
import getGlobalState from './getGlobalState';

import deleteApp from './deleteApp';
import createRevokedApp from './createRevokedApp';

describe('createRevokedApp', () => {
  it('should work', async () => {
    const appIndex = await createRevokedApp(algod, test1Account.sk);

    try {
      console.log('Application Index:', appIndex);

      const state = await getGlobalState(algod, appIndex);

      expect(appIndex).toBeGreaterThan(0);
      expect(state.revoked).toEqual(0);
    } finally {
      await deleteApp(algod, appIndex, test1Account.sk);
    }
  });
});
