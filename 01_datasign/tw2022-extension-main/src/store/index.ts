import { Reducer } from "react";

import * as types from "./types";
import { Action } from "./actions";

export type {
  AccountState,
  AccessLog,
  ProvidedHistories,
  ProvidedHistoryAs1stParty,
  StoreState,
  Setting,
} from "./types";
export type { Action };

export const initialState: types.StoreState = {
  booted: false,
  processing: false,
  encryptedVault: "",
  password: "",
};

export const reducer: Reducer<types.StoreState, Action> = (state, action) => {
  switch (action.type) {
    case "booted":
      return { ...state, booted: action.payload };
    case "setVault":
      return {
        ...state,
        encryptedVault: action.payload.encryptedVault,
        password: action.payload.password || "",
      };
    case "setPassword":
      return {
        ...state,
        password: action.payload.password,
      };
    case "setProcessing":
      return {
        ...state,
        processing: action.payload.processing,
      };
    case "initKeyRing":
      return { ...state, password: action.payload.password };
    case "initKeyRingDone":
      return {
        ...state,
        encryptedVault: action.payload.encryptedVault,
        password: action.payload.password,
      };
    case "updateDwnSetting":
      return { ...state, dwnSetting: action.payload.dwnSetting };
    case "setMasterDIDState":
      return { ...state, didState: action.payload.didState };
    case "setAccessLog":
      return { ...state, accessLog: action.payload.accessLog };
    case "updateAdIdSetting":
      return {
        ...state,
        adIdSetting: action.payload.adIdSetting,
        scope: action.payload.adIdSetting.scope,
        usage: action.payload.adIdSetting.usage,
      };
    case "updateAdIdSettingScope":
      return {
        ...state,
        scope: action.payload.scope,
      };
    case "updateAdIdSettingUsage":
      return {
        ...state,
        usage: action.payload.usage,
      };
    default:
      return state;
  }
  return state;
};
