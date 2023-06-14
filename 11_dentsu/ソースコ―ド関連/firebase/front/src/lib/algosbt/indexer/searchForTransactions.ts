import algosdk from 'algosdk';

const searchForTransactions = async (
  indexer: algosdk.Indexer,
  assetIndex: number,
  limit = 1000
) => {
  let nextToken = '';
  let numTxn = 1;
  const txns = [];

  while (numTxn > 0) {
    const response = await indexer
      .searchForTransactions()
      .assetID(assetIndex)
      .nextToken(nextToken)
      .limit(limit)
      .do();
    const { transactions } = response;
    nextToken = response['next-token'];
    numTxn = transactions.length;

    if (numTxn > 0) {
      txns.push(...transactions);
    }
  }

  return txns;
};

export default searchForTransactions;
