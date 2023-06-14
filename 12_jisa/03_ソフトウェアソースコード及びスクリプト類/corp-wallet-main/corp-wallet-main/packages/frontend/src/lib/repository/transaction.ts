import { proxyHttpRequest } from "../http";

export interface StoredTransaction {
  transactionID?: string;
  title: string;
  description?: string;
  maker?: string;
  status: string;
  updatedAt: number;
  vendor: Actor;
  industryAssociation: Actor;
  theSmallAndMediumEnterpriseAgency: Actor;
}

export interface Actor {
  name: string;
  url: string;
  credentialIssuerUrl: string;
  credential?: {
    name: string;
    credentialID: string;
  };
}

export interface TransactionList {
  [key: string]: StoredTransaction;
}

export const getTransactions = async (): Promise<StoredTransaction[]> => {
  return await proxyHttpRequest("get", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`).then(
    (resp: StoredTransaction[]) => resp
  );
};

export const getTransaction = async (transactionID: string): Promise<StoredTransaction> => {
  return await proxyHttpRequest("get", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/${transactionID}`).then(
    (resp: StoredTransaction) => {
      return resp;
    }
  );
};

// export const getTransaction = async (transactionID: string): Promise<StoredTransaction> => {
//   return await proxyHttpRequest("get", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/${transactionID}`);
// };

export const saveNewTransaction = async (transaction: StoredTransaction): Promise<string> => {
  const transactionID = await proxyHttpRequest("post", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`, {
    transaction,
  }).then((resp: { transactionID: string }) => {
    return resp.transactionID;
  });
  return transactionID;
};

export const updateTransaction = async (transactionID: string, transaction: StoredTransaction): Promise<void> => {
  return await proxyHttpRequest(
    "post",
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/${transactionID}/update`,
    {
      transaction,
    }
  );
};

export const deleteTransaction = async (transactionID: string): Promise<void> => {
  return await proxyHttpRequest("delete", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions/${transactionID}`);
};
