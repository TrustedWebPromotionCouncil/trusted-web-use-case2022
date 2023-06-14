import { describe, it, expect } from 'vitest';

import { testNetAlgod as algod } from '../algod/algods';
import { test1Account } from '../account/secrets';

import getAlgoBalance from './getAlgoBalance';

describe('getAlgoBalance', () => {
  it('should work', async () => {
    const balance = await getAlgoBalance(algod, test1Account.addr);

    expect(balance).toBeDefined();
  });
});
