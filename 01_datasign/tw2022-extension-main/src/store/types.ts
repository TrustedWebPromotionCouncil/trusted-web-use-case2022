import { DIDState } from "../did/types";

export interface DwnSetting {
  defaultLocation: boolean;
  location: string;
}

export type AdScope = "global" | "by_1st_party";
export type AdUsage = "advertiser" | "analytics";

export interface AdIdSetting {
  scope: AdScope;
  usage: AdUsage[];
}

export interface AccessLog {
  date: string;
  owner: string;
  accessor: string;
  recordId: string;
  schema: string;
}

export interface AccountState {
  password?: string;
  encryptedVault?: string;
  didState?: DIDState;
  dwnSetting?: DwnSetting;
  adIdSetting?: AdIdSetting;
}

export interface ProvidedHistory {
  did: string;
  url: string;
  domain: string;
  notBot?: { name: string; agent: { name: string }; result: boolean };
  adId?: { id: string; usage: AdUsage[] };
  mailAddress?: string;
  provided: boolean;
  createdAt: string;
}
export interface PairwiseAccount {
  didState: Pick<DIDState, "shortForm" | "longForm">;
  address: string;
  dwnLocation: string;
}
export interface ProvidedHistoryAs1stParty extends ProvidedHistory {
  pairwiseAccount: PairwiseAccount;
  thirdParties: ProvidedHistoryAs3rdParty[];
}
export interface ProvidedHistoryAs3rdParty extends ProvidedHistory {}
export interface ProvidedHistories {
  histories: ProvidedHistoryAs1stParty[];
  globalAdId: string;
}
export interface StoreState extends AccountState {
  booted: boolean;
  processing: boolean;
  scope?: "global" | "by_1st_party";
  usage?: AdUsage[];
  accessLog?: AccessLog[];
}
export interface Setting {
  reCaptchaSiteHost: string;
  reCaptchaApiHost: string;
  accessLogTargetDid: string;
}
