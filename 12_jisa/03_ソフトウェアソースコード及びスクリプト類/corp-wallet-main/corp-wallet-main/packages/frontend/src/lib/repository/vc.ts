import { LOCAL_STORAGE_VC_REQUEST_KEY } from "../../configs/constants";
import { Manifest } from "../../types";
import { proxyHttpRequest } from "../http";

export interface StoredVC {
  credentialID?: string;
  format?: string;
  type: string[];
  vc: string;
  manifest: Manifest;
  credentialSubject: Record<string, string>;
  vcHistory?: VCHistory[];
  relatedTransactions?: relatedTransaction[];
}

export interface relatedTransaction {
  transactionID: string;
  title: string;
}

export interface VCHistory {
  timestamp: number;
  message: string;
}

export interface VCList {
  [key: string]: StoredVC;
}

export const getVCs = async (): Promise<StoredVC[]> => {
  return await proxyHttpRequest("get", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/credentials`).then(
    (resp: StoredVC[]) => {
      return resp;
    }
  );
};

export const getVC = async (credentialID: string): Promise<StoredVC> => {
  return await proxyHttpRequest("get", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/credentials/${credentialID}`).then(
    (resp: StoredVC) => {
      return resp;
    }
  );
};

export const getVCsByType = async (VCID: string): Promise<StoredVC[]> => {
  // hookを使う
  const VCs = await getVCs();
  // Typeに一致するVCを取得
  const result = VCs.filter((vc) => vc.type.includes(VCID));
  return result;
};

// Save new VC
export const saveNewVC = async (vc: StoredVC): Promise<string> => {
  const credentialID = await proxyHttpRequest("post", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/credentials`, {
    credential: vc,
  }).then((resp: { credentialID: string }) => {
    return resp.credentialID;
  });
  return credentialID;
};

export const cleanVCRequest = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_VC_REQUEST_KEY);
};

export const deleteVC = async (key: string): Promise<void> => {
  const VCs = getVCs();
  delete VCs[key];
  await proxyHttpRequest("delete", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/credentials/${key}`);
};

// TODO: add history to backend
export const addVCHistory = async (key: string, history: VCHistory): Promise<void> => {
  await proxyHttpRequest("post", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/credentials/${key}/addHistory`, {
    history,
  });
};
