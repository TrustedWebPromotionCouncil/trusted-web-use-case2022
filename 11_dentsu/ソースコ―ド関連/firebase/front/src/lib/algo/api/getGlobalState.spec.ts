import { describe, it, expect } from 'vitest';

import { test1Account } from '../account/secrets';
import createApp, { TxnParams } from './createApp';
import deleteApp from './deleteApp';
import approvalTeal from '../teal/revokedApproval.teal';
import clearTeal from '../teal/revokedClear.teal';

import { testNetAlgod as algod } from '../algod/algods';
import compile from './compile';
import getGlobalState from './getGlobalState';

describe('getGlobalState', () => {
  it('getGlobalState should work', async () => {
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

    const appIndex = await createApp(algod, txnParams, test1Account.sk);

    try {
      console.log('Application Index:', appIndex);

      const state = await getGlobalState(algod, appIndex);
      expect(state.revoked).to.eq(0);
    } finally {
      await deleteApp(algod, appIndex, test1Account.sk);
    }
  });
});
