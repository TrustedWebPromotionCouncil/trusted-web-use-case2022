import { describe, it, expect } from 'vitest';

import algosdk from 'algosdk';

import { test1Account } from '../account/secrets';

import { testNetAlgod as algod } from '../algod/algods';
import signSendWaitTxn from './signSendWaitTxn';

describe('signSendWaitTxn', () => {
  it('should work', async () => {
    const suggestedParams = await algod.getTransactionParams().do();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: test1Account.addr,
      to: test1Account.addr,
      amount: 0,
      suggestedParams,
    });

    expect(await signSendWaitTxn(algod, txn, test1Account.sk)).toBeDefined();
  });
});
