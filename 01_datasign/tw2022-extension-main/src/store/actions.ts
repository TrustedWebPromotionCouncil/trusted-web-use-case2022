import { AccessLog, AdIdSetting, AdScope, AdUsage, DwnSetting } from "./types";
import { DIDState } from "../did/types";

export interface BaseAction<T, P> {
  type: T;
  payload: P;
}

type BootedAction = BaseAction<"booted", boolean>;
type SetProcessingAction = BaseAction<"setProcessing", { processing: boolean }>;
type SetPasswordAction = BaseAction<"setPassword", { password: string }>;
type SetVaultAction = BaseAction<
  "setVault",
  { encryptedVault: string; password?: string }
>;
type InitKeyRingAction = BaseAction<"initKeyRing", { password: string }>;
type InitKeyRingDoneAction = BaseAction<
  "initKeyRingDone",
  { encryptedVault: string; password: string }
>;
type updateDwnSettingAction = BaseAction<
  "updateDwnSetting",
  { dwnSetting: DwnSetting }
>;
type setMasterDIDStateAction = BaseAction<
  "setMasterDIDState",
  { didState: DIDState }
>;
type updateAdIdSettingAction = BaseAction<
  "updateAdIdSetting",
  { adIdSetting: AdIdSetting }
>;
type updateAdIdSettingScopeAction = BaseAction<
  "updateAdIdSettingScope",
  { scope: AdScope }
>;
type updateAdIdSettingUsageAction = BaseAction<
  "updateAdIdSettingUsage",
  { usage: AdUsage[] }
>;
type setAccessLogAction = BaseAction<
  "setAccessLog",
  { accessLog: AccessLog[] }
>;

export type Action =
  | BootedAction
  | SetVaultAction
  | SetPasswordAction
  | SetProcessingAction
  | InitKeyRingAction
  | InitKeyRingDoneAction
  | setMasterDIDStateAction
  | setAccessLogAction
  | updateDwnSettingAction
  | updateAdIdSettingAction
  | updateAdIdSettingScopeAction
  | updateAdIdSettingUsageAction;
