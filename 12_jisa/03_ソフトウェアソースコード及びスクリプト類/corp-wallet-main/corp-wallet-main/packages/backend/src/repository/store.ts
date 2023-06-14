import { v4 as uuidv4 } from "uuid";

import { supabase } from "../lib/db/db";
import { Json } from "../lib/db/schema";
import { KeyPair } from "../lib/key/key";

export interface Credential {
  id?: number;
  transactionID: string;
  format?: string;
  vc: string;
  manifest: any;
  type: string[];
  credentialSubject: Record<string, string>;
  vcHistory?: [{ timestamp: number; message: string }];
}

export interface DBKey {
  id: number;
  publicJwk: Json;
  privateJwk: Json | null;
}

export interface DBCredential {
  id: number;
  format: string;
  vc: string;
  manifest: Json;
  type: string[];
  credentialSubject: Json;
  vcHistory: Json[];
  relatedTransactions: Json[];
  credentialID: string;
}

export interface DBTransaction {
  id: number;
  transactionID: string;
  title: string;
  status: string;
  updatedAt: string | null;
  vendor: Json;
  industryAssociation: Json;
  theSmallAndMediumEnterpriseAgency: Json;
  maker: string;
}

export const saveNewKeyPair = async (keyPair: KeyPair) => {
  const insertData = {
    id: 1,
    ...keyPair,
  } as DBKey;
  console.log(insertData);
  const { data, error } = await supabase.from("key").insert([insertData]);
  if (error) {
    console.error(error);
  }
};

export const getKeyPair = async (): Promise<DBKey | undefined> => {
  const { data: storedKeyPair } = await supabase.from("key").select("*");
  if (storedKeyPair.length === 0) {
    return undefined;
  }
  return storedKeyPair[0];
};

export const getCredentials = async (): Promise<DBCredential[]> => {
  const { data: storedCredentials } = await supabase.from("credential").select("*").order("id", { ascending: false });
  return storedCredentials;
};

export const getCredential = async (credentialID: string): Promise<DBCredential> => {
  const { data: storedCredentials } = await supabase.from("credential").select("*").eq("credentialID", credentialID);
  return storedCredentials[0];
};

export const saveNewCredential = async (credential: DBCredential): Promise<string> => {
  const credentialID = uuidv4();
  await supabase.from("credential").insert([
    {
      ...credential,
      credentialID: credentialID,
    },
  ]);
  return credentialID;
};

interface VCHistory {
  timestamp: number;
  message: string;
}

export const addVCHistory = async (credentialID: string, history: VCHistory) => {
  const { data: credential } = await supabase.from("credential").select("*").eq("credentialID", credentialID);
  credential[0].vcHistory.push(history as any);
  const { data, error } = await supabase
    .from("credential")
    .update({ vcHistory: credential[0].vcHistory })
    .eq("credentialID", credentialID);
  if (error) {
    console.error(error);
  }
};

export const deleteCredentials = async (credentialID: string) => {
  const { data, error } = await supabase.from("credential").delete().eq("credentialID", credentialID);
  if (error) {
    console.error(error);
  }
};

/** Transactions */

export const getTransactions = async (): Promise<DBTransaction[]> => {
  const { data: storedTransactions } = await supabase.from("transaction").select("*").order("id", { ascending: false });
  return storedTransactions;
};

export const getTransaction = async (transactionID: string): Promise<DBTransaction> => {
  const { data: storedTransactions } = await supabase
    .from("transaction")
    .select("*")
    .eq("transactionID", transactionID);
  return storedTransactions[0];
};

export const saveNewTransaction = async (transaction: DBTransaction) => {
  const transactionID = uuidv4();
  const { data, error } = await supabase.from("transaction").insert([
    {
      ...transaction,
      transactionID: transactionID,
    },
  ]);
  if (error) {
    console.error(error);
  }
  return transactionID;
};

export const deleteTransaction = async (transactionID: string) => {
  const { data, error } = await supabase.from("transaction").delete().eq("transactionID", transactionID);
  if (error) {
    console.error(error);
  }
};

export const updateTransaction = async (transactionID: string, transaction: DBTransaction) => {
  const { data, error } = await supabase.from("transaction").update(transaction).eq("transactionID", transactionID);
  if (error) {
    console.error(error);
  }
};
