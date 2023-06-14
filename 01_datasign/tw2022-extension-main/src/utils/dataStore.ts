import {
  AccountState,
  ProvidedHistories,
  ProvidedHistoryAs1stParty,
  Setting,
} from "@/store";
import { FirstParty, VerifiedContext } from "../../bundles/src/types";
import { AuthToken } from "@/shared/apiClient";

// https://developer.chrome.com/docs/extensions/mv3/service_workers/#react
// https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
// https://developer.chrome.com/docs/extensions/reference/storage

export type SyncSchema =
  | "AccountState"
  | "VerificationHistory"
  | "ProvidingHistory";
export const syncToDwn = async (schema: SyncSchema) => {
  await chrome.runtime.sendMessage({
    data: {
      type: "syncToDwn",
      schema,
    },
  });
};
export const syncFromDwn = async (schema: SyncSchema) => {
  await chrome.runtime.sendMessage({
    data: {
      type: "syncFromDwn",
      schema,
    },
  });
};

export const setPassword = async (password: string) => {
  await chrome.runtime.sendMessage({
    data: {
      type: "setPassword",
      password,
    },
  });
};

export const getPassword = async () => {
  const response = await chrome.runtime.sendMessage({
    data: {
      type: "getPassword",
    },
  });
  console.debug({ response });
  return response.password ?? "";
};

export const saveAccountState = async (payload: AccountState) => {
  const data = await chrome.storage.local.get("accountState");
  const old = data.accountState || {};
  console.log({ old });
  const { password, ...rest } = payload; // remove password
  await chrome.storage.local.set({ accountState: { ...old, ...rest } });
};
export const getAccountStatus = async () => {
  const data = await chrome.storage.local.get("accountState");
  return (data.accountState as AccountState) || ({} as AccountState);
};

export const getVerifiedContextAll = async () => {
  const data = await chrome.storage.local.get("verifiedContext");
  const ctx: VerifiedContext = data["verifiedContext"];
  return ctx;
};
export const getVerifiedContext = async (host: string) => {
  const data = await chrome.storage.local.get("verifiedContext");
  const ctx: VerifiedContext = data["verifiedContext"];
  return ctx && ctx[host];
};
export const setVerifiedContext = async (result: FirstParty) => {
  const data = await chrome.storage.local.get("verifiedContext");
  const old = data.verifiedContext || {};
  await chrome.storage.local.set({
    verifiedContext: { ...old, [new URL(result.url).host]: result },
  });
};

export const initialProvidedHistories: ProvidedHistories = {
  histories: [],
  globalAdId: "",
};
export const saveProvidedHistories = async (
  payload: ProvidedHistoryAs1stParty,
  globalAdId?: string
) => {
  const data = await chrome.storage.local.get("providedHistories");
  const providedHistories: ProvidedHistories = data.providedHistories || {
    histories: [],
    globalAdId: "",
  };
  providedHistories.histories.push(payload);
  if (globalAdId) {
    providedHistories.globalAdId = globalAdId;
  }
  await chrome.storage.local.set({ providedHistories });
};
export const getProvidedHistories = async () => {
  const data = await chrome.storage.local.get("providedHistories");
  return (
    (data.providedHistories as ProvidedHistories) || {
      histories: [],
      globalAdId: "",
    }
  );
};

export const DEFAULT_SETTING = {
  reCaptchaSiteHost: "https://site.re-capthca.example.com",
  reCaptchaApiHost: "https://api.re-capthca.example.com",
  accessLogTargetDid: "did:ion:EiAitvVc6ZZUQEA2B7gZHi0cSXXpjGiHuv00tCmrGH9dGQ",
};
export const getSetting = async () => {
  const data = await chrome.storage.local.get("setting");
  const setting: Setting = data["setting"];
  if (!setting) {
    const _setting = { ...DEFAULT_SETTING };
    await setSetting(_setting);
    return _setting;
  }
  return setting;
};
export const setSetting = async (setting: Setting) => {
  await chrome.storage.local.set({ setting });
};

export const clearDataOnBackground = async () => {
  console.debug("clear stored data on background");
  await chrome.runtime.sendMessage({
    data: {
      type: "clearAll",
    },
  });
  console.debug("clear local storage");
  await chrome.storage.local.clear();
};

export const ASYNC_STORAGE_KEY_EMAIL = "email";

export const getLocalStorage = async (key: string) => {
  const data = await chrome.storage.local.get(key);
  return data[key];
};

export const setLocalStorage = (key: string, value: any) => {
  return chrome.storage.local.set({ [key]: value });
};

export const removeLocalStorage = (keys: string | string[]) => {
  return chrome.storage.local.remove(keys);
};

export default {
  syncToDwn,
  syncFromDwn,
  getAccountStatus,
  saveAccountState,
  getProvidedHistories,
  saveProvidedHistories,
  getVerifiedContext,
  getVerifiedContextAll,
  setVerifiedContext,
  getSetting,
  setSetting,
};
