import { describe, it, expect } from 'vitest';

import algosdk from 'algosdk';

import { test1Account } from '../account/secrets';

import { testNetAlgod } from '../algod/algods';
import sendWaitTxn from './sendWaitTxn';

describe('sendWaitTxn', () => {
  it('should work', async () => {
    const suggestedParams = await testNetAlgod.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: test1Account.addr,
      to: test1Account.addr,
      amount: 0,
      suggestedParams,
    });

    const signedTxn = txn.signTxn(test1Account.sk);

    expect(await sendWaitTxn(testNetAlgod, signedTxn)).to.not.be.empty;
  });
});
