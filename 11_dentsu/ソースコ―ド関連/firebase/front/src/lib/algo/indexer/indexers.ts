import { ChainType } from '../../types';
import algosdk from 'algosdk';

const MAINNET_ALGO_INDEXER = 'https://algoindexer.algoexplorerapi.io';
const TESTNET_ALGO_INDEXER = 'https://algoindexer.testnet.algoexplorerapi.io';

export const mainNetAlgoIndexer = new algosdk.Indexer(
  '',
  MAINNET_ALGO_INDEXER,
  443
);
export const testNetAlgoIndexer = new algosdk.Indexer(
  '',
  TESTNET_ALGO_INDEXER,
  443
);

export const getIndexer = (chainType: ChainType) => {
  if (chainType == ChainType.TestNet) {
    return testNetAlgoIndexer;
  }

  return mainNetAlgoIndexer;
};
