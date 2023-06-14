import React, { useEffect } from "react";

import { getTransactions, StoredTransaction } from "../lib/repository/transaction";

export const useStoredTransactions = (transactionID?: string): { storedTransactions: StoredTransaction[] } => {
  const [storedTransactions, setStoredTransactions] = React.useState<StoredTransaction[]>([]);
  useEffect(() => {
    (async () => {
      const transactions = await getTransactions();
      if (transactions) {
        const storedTransactions = Object.values(transactions).map((transaction) => {
          return transaction;
        });
        if (transactionID) {
          setStoredTransactions(
            storedTransactions.filter((transaction) => transaction.transactionID === transactionID)
          );
        } else {
          setStoredTransactions(storedTransactions);
        }
      }
    })();
  }, [transactionID]);
  return { storedTransactions };
};
