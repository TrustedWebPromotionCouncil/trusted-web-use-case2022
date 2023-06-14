import { describe, it, expect } from 'vitest';

import { ChainType } from '../../types';

import { mainNetAlgoIndexer, testNetAlgoIndexer, getIndexer } from './indexers';

describe('indexers', () => {
  it('mainNetAlgoIndexer should work', async () => {
    expect(await mainNetAlgoIndexer.makeHealthCheck()).toBeDefined();
  });

  it('testNetAlgoIndexer should work', async () => {
    expect(await testNetAlgoIndexer.makeHealthCheck()).toBeDefined();
  });

  it('getIndexer should work', async () => {
    expect(getIndexer(ChainType.TestNet)).to.eq(testNetAlgoIndexer);
    expect(getIndexer(ChainType.MainNet)).to.eq(mainNetAlgoIndexer);
  });
});
