import {
  FirstParty,
  Party,
  Providable,
  ProvidableFirstParty,
  VerifiedResult,
  VerifiedResultHasOpDoc,
  VerifiedResultOK,
} from "./types";
import ec from "../../src/keys/elliptic";
import ion from "../../src/did/ion";
import { SingleHDKeyRingController } from "../../src/keyRing/SingleHDKeyRingController";
import { DIDState, IssuablePerson } from "../../src/utils/types";
import {
  AdIdSetting,
  AdUsage,
  PairwiseAccount,
  ProvidedHistoryAs1stParty,
} from "../../src/store/types";
import ds from "../../src/utils/dataStore";
import { getHolder, verifyParty } from "./verifyParty";
import pd, { registerNotBotDID } from "./personalData";
import dc from "./dwnClient";
import am, { reProducePairwiseAccount } from "./accountManager";

interface SuccessResult {
  type: "success";
}
interface FailureResult {
  type: "failure";
  reason: string;
}

type DefaultResult = SuccessResult | FailureResult;

export const getAllowedThirdParties = <T>(
  thirdParties: (VerifiedResult & T)[],
  allowedSetting: string[]
) => {
  const okList = thirdParties.filter(
    (vr): vr is VerifiedResultOK & T => vr.verified === "ok"
  );
  const verifiedResults: (VerifiedResultOK & T)[] = [];
  for (const vr of okList) {
    const holder = getHolder(vr.originatorProfile);
    if (
      holder &&
      holder.businessCategory &&
      holder.businessCategory.every((category) =>
        allowedSetting.includes(category)
      )
    ) {
      verifiedResults.push(vr);
    }
  }
  return verifiedResults;
};
export const getAllowedUrl = (
  thirdParties: VerifiedResult[],
  allowedSetting: string[]
) => {
  return getAllowedThirdParties(thirdParties, allowedSetting).map(
    (vr) => vr.originatorProfile.sub
  );
};

const unLockKeyRing = async (encryptedVault: string, password: string) => {
  const initState = { vault: encryptedVault };
  const keyRingController = new SingleHDKeyRingController({ initState });
  await keyRingController.unlock(password);
  return keyRingController;
};

export const collectPairwiseAccount = async (): Promise<PairwiseAccount[]> => {
  const providedHistories = await ds.getProvidedHistories();
  const pairwiseAccounts = providedHistories.histories.map(
    (h) => h.pairwiseAccount
  );
  // remove duplication
  const mp: { [key: string]: PairwiseAccount } = {};
  for (const pa of pairwiseAccounts) {
    mp[pa.address] = pa;
  }
  return Object.entries(mp).map(([key, value]) => {
    return value;
  });
};

const FAILURE_REASON_NEED_PASSWORD_RE_INPUT: FailureResult = {
  type: "failure",
  reason: "need password re-input",
};
const FAILURE_REASON_ILLEGAL_STORAGE_STATE: FailureResult = {
  type: "failure",
  reason: "illegal storage state",
};
// --------------------------------not bot------------------------------------
export const sendChallengeToken = async (
  password: string,
  token: string
): Promise<DefaultResult> => {
  if (!password) {
    return FAILURE_REASON_NEED_PASSWORD_RE_INPUT;
  }
  console.debug("challenge token -> " + token);
  const accountState = await ds.getAccountStatus();
  const { didState, encryptedVault } = accountState;
  if (didState && encryptedVault) {
    const keyRing = await unLockKeyRing(encryptedVault, password);
    const account = await am.getAccount(keyRing, 0); // get master account
    try {
      const setting = await ds.getSetting();
      await registerNotBotDID(
        { didState, privateKeyHex: account.privateKeyHex },
        token,
        setting.reCaptchaApiHost
      );
      return { type: "success" };
    } catch (err) {
      console.error(err);
      return { type: "failure", reason: (err as Error).name };
    }
  } else {
    return FAILURE_REASON_ILLEGAL_STORAGE_STATE;
  }
};
// --------------------------------verify------------------------------------

export const verifyOriginator = async (url: string) => {
  console.debug("verify originator");
  // verify 1st-party
  const result = await verifyParty(url);
  console.debug("verify originator done", result);
  return result;
};

// --------------------------------provide------------------------------------
interface MainAccount {
  didState: Pick<DIDState, "longForm" | "shortForm">;
  adIdSetting: AdIdSetting;
  privateKeyHex: string;
}

export const issuePairwiseDid = async (
  privateKeyHex: string,
  dwnLocation: string
) => {
  const didState = await ion.issueDID(privateKeyHex, dwnLocation);
  return { didState, privateKeyHex, dwnLocation };
};

export const makeAutomaticallyConsentedParties = (
  firstParty: FirstParty<VerifiedResult> & VerifiedResult
): ProvidableFirstParty | undefined => {
  const { did, verified, thirdParties } = firstParty;
  if (!did) {
    throw new Error("did not found at 1st-party");
  }
  if (
    verified === "ok" ||
    verified === "ng" ||
    verified === "unmatched_domain"
  ) {
    if (thirdParties) {
      const _thirdParties = thirdParties
        .filter(
          (p): p is VerifiedResultHasOpDoc & Party =>
            p.verified === "ok" || p.verified === "ng"
        )
        .map((p) => {
          return {
            ...p,
            consentToProvide: p.did !== undefined,
          };
        });
      return {
        ...firstParty,
        consentToProvide: true,
        thirdParties: _thirdParties,
      };
    } else {
      return {
        ...firstParty,
        consentToProvide: true,
        thirdParties: [],
      };
    }
  }
};

interface ProvidePersonalDataSuccess extends SuccessResult {
  history: ProvidedHistoryAs1stParty;
}
export const providePersonalData = async (
  password: string,
  host: string,
  pairwiseAccount: Required<IssuablePerson> & { address: string },
  adUsages?: AdUsage[]
): Promise<ProvidePersonalDataSuccess | FailureResult> => {
  if (!password) {
    return FAILURE_REASON_NEED_PASSWORD_RE_INPUT;
  }
  const accountState = await ds.getAccountStatus();
  const {
    didState: didState1,
    encryptedVault,
    dwnSetting,
    adIdSetting,
  } = accountState;
  if (didState1 && encryptedVault && dwnSetting && adIdSetting) {
    const keyRing = await unLockKeyRing(encryptedVault, password);
    const account = await am.getAccount(keyRing, 0);
    const ctx = await ds.getVerifiedContext(host);
    if (ctx) {
      const mainAccount = {
        didState: didState1,
        privateKeyHex: account.privateKeyHex,
        adIdSetting: {
          scope: adIdSetting.scope,
          usage: adUsages || adIdSetting.usage,
        },
      };
      const firstParty = makeAutomaticallyConsentedParties(ctx);
      if (firstParty && firstParty.did) {
        const history = await _providePersonalData(
          mainAccount,
          pairwiseAccount,
          firstParty
        );
        return { type: "success", history };
      } else {
        return { type: "failure", reason: "consent data not found" };
      }
    } else {
      return { type: "failure", reason: "verification result not found" };
    }
  } else {
    return FAILURE_REASON_ILLEGAL_STORAGE_STATE;
  }
};

export const _providePersonalData = async (
  mainAccount: MainAccount,
  pairwiseAccount: PairwiseAccount & { privateKeyHex: string },
  firstParty: ProvidableFirstParty
): Promise<ProvidedHistoryAs1stParty> => {
  console.debug("provide personal data");
  const { adIdSetting } = mainAccount;
  const { didState, address, dwnLocation } = pairwiseAccount;
  const providedHistories = await ds.getProvidedHistories();
  const adId = pd.determineAdId(providedHistories, adIdSetting);
  // issue not bot vc
  const setting = await ds.getSetting();
  const notBotVc = await pd.issueNotBotVC(
    mainAccount,
    didState.longForm,
    setting.reCaptchaApiHost
  );
  const { vcJwt, issuer } = await pd.makeVc(pairwiseAccount, { adId });
  const vp = await pd.makeVp([notBotVc.vc, vcJwt], issuer);
  const ca = new Date().toISOString();
  // provide to 1st party
  const { did, ...rest } = firstParty;
  const _p = { did: did!, ...rest };
  await _send(pairwiseAccount, _p, vp);
  const history = pd.makeHistory(_p, ca, { notBot: notBotVc.payload, adId });
  // provide to 3rd party
  const { thirdParties } = firstParty;
  const _allowedThirdParties = getAllowedThirdParties<Party & Providable>(
    thirdParties || [],
    adIdSetting.usage
  );
  const _thirdParties = [];
  for (const party of _allowedThirdParties) {
    const { did, ...rest } = party;
    if (did) {
      const _p = { did, ...rest };
      await _send(pairwiseAccount, _p, vp);
      const history = pd.makeHistory(_p, ca, {
        notBot: notBotVc.payload,
        adId,
      });
      _thirdParties.push(history);
    }
  }
  // save provided history
  const newHistories = {
    pairwiseAccount: { didState, address, dwnLocation },
    ...history,
    thirdParties: _thirdParties,
  };
  if (adIdSetting.scope === "global" && adId.issued) {
    await ds.saveProvidedHistories(newHistories, adId.id);
  } else {
    await ds.saveProvidedHistories(newHistories);
  }
  return newHistories;
};

export const provideMailAddress = async (
  password: string,
  host: string,
  email: string
): Promise<DefaultResult> => {
  if (!password) {
    return FAILURE_REASON_NEED_PASSWORD_RE_INPUT;
  }
  const accountState = await ds.getAccountStatus();
  const { didState: didState1, encryptedVault, dwnSetting } = accountState;
  if (didState1 && encryptedVault && dwnSetting) {
    const ctx = await ds.getVerifiedContext(host);
    if (ctx) {
      const his = await ds.getProvidedHistories();
      const h = his.histories.find((h) => new URL(h.url).host === host);
      if (h) {
        const keyRing = await unLockKeyRing(encryptedVault, password);
        const issuedPairwiseAccount = await collectPairwiseAccount();
        const pairwiseAccountsWithKey = await am.reProducePairwiseAccount(
          keyRing,
          issuedPairwiseAccount.length
        );
        const firstParty = makeAutomaticallyConsentedParties(ctx);
        if (firstParty && firstParty.did) {
          const privateKeyHex =
            pairwiseAccountsWithKey[h.pairwiseAccount.address];
          const pa = { ...h.pairwiseAccount, privateKeyHex };
          await _provideMailAddress(pa, email, firstParty);
          return { type: "success" };
        } else {
          const reason = `consent data not found`;
          return { type: "failure", reason };
        }
      } else {
        const reason = `pairwise account was not issued yet in this host. ${host}`;
        return { type: "failure", reason };
      }
    } else {
      const reason = `verification was not executed yet in this host. ${host}`;
      return { type: "failure", reason };
    }
  } else {
    return FAILURE_REASON_ILLEGAL_STORAGE_STATE;
  }
};

export const _provideMailAddress = async (
  pairwiseAccount: PairwiseAccount & { privateKeyHex: string },
  mailAddress: string,
  firstParty: ProvidableFirstParty
): Promise<ProvidedHistoryAs1stParty> => {
  console.debug("provide mail address");
  const { didState, address, dwnLocation } = pairwiseAccount;
  // issue not bot vc
  const { vcJwt, issuer } = await pd.makeVc(pairwiseAccount, { mailAddress });
  const vp = await pd.makeVp([vcJwt], issuer);
  const ca = new Date().toISOString();
  // provide to 1st party
  const { did, ...rest } = firstParty;
  const _p = { did: did!, ...rest };
  await _send(pairwiseAccount, _p, vp);
  const history = pd.makeHistory(_p, ca, { mailAddress });
  // provide to 3rd party
  const { thirdParties } = firstParty;
  const _thirdParties = [];
  for (const party of thirdParties || []) {
    const { did, ...rest } = party;
    if (did) {
      const _p = { did, ...rest };
      await _send(pairwiseAccount, _p, vp);
      const history = pd.makeHistory(_p, ca, { mailAddress });
      _thirdParties.push(history);
    }
  }
  // save provided history
  const newHistories = {
    pairwiseAccount: { didState, address, dwnLocation },
    ...history,
    thirdParties: _thirdParties,
  };
  await ds.saveProvidedHistories(newHistories);
  return newHistories;
};

const _send = async (
  pairwiseAccount: Required<IssuablePerson>,
  party: Required<Party> & Providable,
  vp: string
) => {
  try {
    if (party.consentToProvide) {
      const ret = await dc.writeMessage(
        pairwiseAccount,
        party.did,
        vp,
        "PersonalData",
        false
      );
      console.debug({ writeMessageResponse: ret });
    }
  } catch (err) {
    console.error(err);
    throw new Error("t.b.d");
  }
};

// --------------------------------access log------------------------------------

interface AccessLog {
  accessor: string;
  recordId: string;
  schema: string;
}
type ReturnType = AccessLog & { date: string; owner: string };
interface GetAccessLogResult extends SuccessResult {
  accessLog: ReturnType[];
}

export const getAccessLog = async (
  password: string
): Promise<GetAccessLogResult | FailureResult> => {
  if (!password) {
    return FAILURE_REASON_NEED_PASSWORD_RE_INPUT;
  }
  const accountState = await ds.getAccountStatus();
  const { didState, encryptedVault, dwnSetting } = accountState;
  if (didState && encryptedVault && dwnSetting) {
    const keyRing = await unLockKeyRing(encryptedVault, password);
    const accessLog = await _getAccessLog(keyRing);
    return { type: "success", accessLog };
  }
  return FAILURE_REASON_ILLEGAL_STORAGE_STATE;
};

export const _getAccessLog = async (
  keyRingController: SingleHDKeyRingController
) => {
  const pairwiseAccounts = await collectPairwiseAccount();
  const pairwiseAccountsWithKey = await reProducePairwiseAccount(
    keyRingController,
    pairwiseAccounts.length
  );
  const recipients: IssuablePerson[] = [];
  for (const pa of pairwiseAccounts) {
    const { address, didState, dwnLocation } = pa;
    const key = pairwiseAccountsWithKey[address];
    recipients.push({
      didState,
      privateKeyHex: key,
      dwnLocation,
    });
  }
  const setting = await ds.getSetting();
  /*
  |  schema    | target                                                    | recipient           | author              | published |
  | ---------- | --------------------------------------------------------- | ------------------- | ------------------- | --------- |
  | access log | d-web node servicer(but it should be personal data owner) | personal data owner | d-web node servicer | false     |
   */
  let ret: ReturnType[] = [];
  for (const r of recipients) {
    const { didState, privateKeyHex, dwnLocation } = r;
    if (!dwnLocation) {
      throw new Error("dwn location is not set!");
    }
    const target = {
      did: setting.accessLogTargetDid,
      dwnLocation, // irregular rule only for access log where target is not data owner
    };
    const recipient = {
      did: didState.longForm,
      privateKeyJwk: ec.privateKeyHexToJwk(privateKeyHex),
      keyId: "key-1",
    };
    const filter = {
      recipient: didState.longForm,
    };
    const data = await dc.queryMessage(target, recipient, filter);
    if (data.entries) {
      const arr = data.entries.map((entry) => {
        const { descriptor } = entry;
        const data = JSON.parse(entry.data);
        return {
          owner: didState.shortForm,
          date: descriptor.dateCreated,
          ...data,
        };
      });
      ret = ret.concat(arr);
    }
  }
  // order by date desc
  ret.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else if (b.date < a.date) {
      return -1;
    } else {
      return 0;
    }
  });
  return ret;
};

// --------------------------------sync to dwn------------------------------------
export type SyncSchema =
  | "AccountState"
  | "VerificationHistory"
  | "ProvidingHistory";
export const syncToDwn = async (
  password: string,
  schema: SyncSchema
): Promise<DefaultResult> => {
  if (!password) {
    return FAILURE_REASON_NEED_PASSWORD_RE_INPUT;
  }
  const accountState = await ds.getAccountStatus();
  const { didState, encryptedVault, dwnSetting } = accountState;
  if (didState && encryptedVault && dwnSetting) {
    let data = null;
    if (schema === "VerificationHistory") {
      data = await ds.getVerifiedContextAll();
    } else if (schema === "ProvidingHistory") {
      data = await ds.getProvidedHistories();
    } else {
      const { encryptedVault, ...rest } = accountState;
      data = { ...rest };
    }
    const keyRing = await unLockKeyRing(encryptedVault, password);
    const account = await am.getAccount(keyRing, 0); // get master account
    const privateKeyHex = account.privateKeyHex;
    const dwnLocation = dwnSetting.location;
    const writeTarget = { didState, privateKeyHex, dwnLocation };
    try {
      const res = await dc.writeMessage(
        writeTarget,
        didState.longForm,
        JSON.stringify(data),
        schema,
        false
      );
      console.debug({ res });
      return { type: "success" };
    } catch (err) {
      console.error(err);
      return { type: "failure", reason: (err as Error).name };
    }
  } else {
    return FAILURE_REASON_ILLEGAL_STORAGE_STATE;
  }
};

export const syncFromDwn = async (
  password: string,
  schema: SyncSchema
): Promise<DefaultResult> => {
  if (!password) {
    return FAILURE_REASON_NEED_PASSWORD_RE_INPUT;
  }
  const accountState = await ds.getAccountStatus();
  const { didState, encryptedVault, dwnSetting } = accountState;
  if (didState && encryptedVault && dwnSetting) {
    const keyRing = await unLockKeyRing(encryptedVault, password);
    const account = await am.getAccount(keyRing, 0); // get master account
    const privateKeyHex = account.privateKeyHex;
    const dwnLocation = dwnSetting.location;
    const target = { did: didState.longForm, dwnLocation };
    const recipient = {
      did: didState.longForm,
      privateKeyJwk: ec.privateKeyHexToJwk(privateKeyHex),
      keyId: "key-1",
    };
    const filter = {
      recipient: didState.longForm,
      schema,
    };
    try {
      const reply = await dc.queryMessage(target, recipient, filter);
      console.debug({ reply });
      if (reply.entries) {
        for (const entry of reply.entries) {
          console.debug("data", entry.data);
        }
      }
      // todo implementation
      // if (schema === "VerificationHistory") {
      //   data = await ds.getVerifiedContextAll();
      // } else if (schema === "ProvidingHistory") {
      //   data = await ds.getProvidedHistories();
      // } else {
      //   const { encryptedVault, ...rest } = accountState;
      //   data = { ...rest };
      // }
      return { type: "success" };
    } catch (err) {
      console.error(err);
      return { type: "failure", reason: (err as Error).name };
    }
  } else {
    return FAILURE_REASON_ILLEGAL_STORAGE_STATE;
  }
};

export default {
  sendChallengeToken,
  verifyOriginator,
  providePersonalData,
  provideMailAddress,
  makeAutomaticallyConsentedParties,
  unLockKeyRing,
  getAccessLog,
  collectPairwiseAccount,
  syncToDwn,
  syncFromDwn,
  getAllowedUrl,
};
