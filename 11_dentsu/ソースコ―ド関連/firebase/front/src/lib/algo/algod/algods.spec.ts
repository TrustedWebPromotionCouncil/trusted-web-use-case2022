import { describe, it, expect } from 'vitest';

import { ChainType } from '../../../lib/types';

import { mainNetAlgod, testNetAlgod, getAlgod } from './algods';

describe('algods', () => {
  it('mainNetAlgod should work', async () => {
    expect(await mainNetAlgod.status()).toBeDefined();
  });

  it('testNetAlgod should work', async () => {
    expect(await testNetAlgod.status()).toBeDefined();
  });

  it('getAlgod should work', async () => {
    expect(getAlgod(ChainType.TestNet)).toEqual(testNetAlgod);
    expect(getAlgod(ChainType.MainNet)).toEqual(mainNetAlgod);
  });
});
