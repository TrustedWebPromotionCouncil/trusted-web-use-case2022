import am from "./accountManager";
import ah, { SyncSchema } from "./asyncHandler";
import ds from "../../src/utils/dataStore";
import Rule = chrome.declarativeNetRequest.Rule;
import RuleAction = chrome.declarativeNetRequest.RuleAction;
import { FirstParty, VerifiedFirstParty, VerifiedResult } from "./types";
import { AccountState, AdIdSetting, AdUsage } from "../../src/store/types";

console.debug("background");

const storedData: { password: string; waitVerification: boolean } = {
  password: "",
  waitVerification: false,
};

const _addEventListeners = () => {
  console.log("add all event listeners");
  const onSetPassword = (password: string) => {
    console.debug("update password");
    Object.assign(storedData, { password });
  };
  const onGetPassword = (sendResponse: (response?: any) => void) => {
    console.debug("return password");
    sendResponse(storedData);
  };
  const onGetAccessLog = async (password: string) => {
    const result = await ah.getAccessLog(password);
    if (result.type === "success") {
      const { accessLog } = result;
      const data = { type: "setAccessLog", accessLog };
      console.debug("send access log", accessLog);
      await chrome.runtime.sendMessage({ data });
    } else {
      console.error(result.reason);
    }
  };
  const onSendPersonalData = async (
    tabId: number,
    password: string,
    data: { host: string; pairwiseAccount: any; adIdUsage?: AdUsage[] }
  ) => {
    const { host, pairwiseAccount: pa, adIdUsage } = data;
    const result = await ah.providePersonalData(password, host, pa, adIdUsage);
    if (result.type === "success") {
      console.info("providing personal data is done");
      const { didState, ...rest1 } = pa;
      const { ops, ...rest2 } = didState;
      const data = {
        type: "notifyPairwiseDid",
        payload: { didState: { ...rest2 } },
      };
      await chrome.tabs.sendMessage(tabId!, { data });
      const result = await ah.syncToDwn(password, "ProvidingHistory");
      if (result.type !== "success") {
        console.error(result.reason);
      }
    } else {
      console.error(result.reason);
    }
  };
  const onSendMailAddress = async (
    password: string,
    data: { host: string; email: string }
  ) => {
    const { host, email } = data;
    const result = await ah.provideMailAddress(password, host, email);
    if (result.type === "success") {
      console.info("providing mail address is done");
      const result = await ah.syncToDwn(password, "ProvidingHistory");
      if (result.type !== "success") {
        console.error(result.reason);
      }
    } else {
      console.error(result.reason);
    }
  };
  const onSendChallengeToken = async (
    tabId: number,
    password: string,
    data: { token: string }
  ) => {
    const { token } = data;
    const result = await ah.sendChallengeToken(password, token);
    if (result.type === "success") {
      await chrome.tabs.sendMessage(tabId!, {
        data: {
          type: "completeChallenge",
          result: "success",
        },
      });
    } else {
      console.error(result.reason);
    }
  };
  const onSyncToDwn = async (
    password: string,
    data: { schema: SyncSchema }
  ) => {
    await ah.syncToDwn(password, data.schema);
  };
  const onSyncFromDwn = async (
    password: string,
    data: { schema: SyncSchema }
  ) => {
    await ah.syncFromDwn(password, data.schema);
  };
  const onRestoreBlockingRules = async () => {
    await _restoreBlockingRules();
  };
  const onClearNonDefaultRules = async () => {
    await _set3rdPartyBlocker();
  };
  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      const tabId = sender.tab?.id;
      if (message.data) {
        const { type } = message.data;
        const { password } = storedData;
        if (type === "setPassword") {
          onSetPassword(message.data.password);
        } else if (type === "getPassword") {
          onGetPassword(sendResponse);
        } else if (type === "getAccessLog") {
          await onGetAccessLog(password);
        } else if (type === "sendPersonalData") {
          await onSendPersonalData(tabId!, password, message.data);
        } else if (type === "sendMailAddress") {
          await onSendMailAddress(password, message.data);
        } else if (type === "sendChallengeToken") {
          await onSendChallengeToken(tabId!, password, message.data);
        } else if (type === "syncToDwn") {
          await onSyncToDwn(password, message.data);
        } else if (type === "syncFromDwn") {
          await onSyncFromDwn(password, message.data);
        } else if (type === "restoreBlockingRules") {
          await onRestoreBlockingRules();
        } else if (type === "clearNonDefaultRules") {
          await onClearNonDefaultRules();
        } else if (type === "clearAll") {
          Object.assign(storedData, {});
        }
      }
    }
  );
};
const _restoreBlockingRules = async () => {
  const accountState = await ds.getAccountStatus();
  const { adIdSetting } = accountState;
  if (adIdSetting) {
    const results = await ds.getVerifiedContextAll();
    for (const domain of Object.keys(results)) {
      const result = results[domain];
      console.debug({ domain, result });
      if (result.verified === "ok") {
        await _setUnBlocker(result, adIdSetting);
      }
    }
  }
};

const _allowRule = (id: number, priority: number, urlFilter: string) => {
  return {
    id,
    priority,
    action: { type: chrome.declarativeNetRequest.RuleActionType.ALLOW },
    condition: {
      urlFilter,
      excludedTabIds: [chrome.tabs.TAB_ID_NONE],
    },
  };
};
const _set3rdPartyBlocker = async () => {
  const sessionRules = await chrome.declarativeNetRequest.getSessionRules();
  const rule = {
    id: 1,
    priority: 1,
    action: { type: chrome.declarativeNetRequest.RuleActionType.BLOCK },
    condition: {
      domainType: chrome.declarativeNetRequest.DomainType.THIRD_PARTY,
      excludedTabIds: [chrome.tabs.TAB_ID_NONE],
    },
  };
  const urlFilters = [
    "https://beta.ion.msidentity.com",
    "https://www.google.com/recaptcha",
    "https://www.gstatic.com/recaptcha",
    "https://api.bunsin.io/v1/me",
  ];
  const allowRules = urlFilters.map((uf, index) => {
    return _allowRule(rule.id + (index + 1), 1, uf);
  });

  const option = {
    addRules: [rule, ...allowRules],
    removeRuleIds: sessionRules.map((rule) => rule.id),
  };
  try {
    await chrome.declarativeNetRequest.updateSessionRules(option);
  } catch (err) {
    console.error(err);
  }
};

const _setUnBlocker = async (
  result: FirstParty<VerifiedResult> & VerifiedResult,
  adIdSetting: AdIdSetting,
  tabId?: number
) => {
  console.log("set un-blocker", result);
  // save verified result
  await ds.setVerifiedContext(result);

  // set allowed rule
  const { thirdParties } = result;
  if (thirdParties) {
    const allowList = ah.getAllowedUrl(thirdParties, adIdSetting.usage);
    if (0 < allowList.length) {
      const sessionRules = await chrome.declarativeNetRequest.getSessionRules();
      console.log(sessionRules);
      const ids = sessionRules.map((r) => r.id);
      let id = 0 < ids.length ? Math.max(...ids) : 0;
      const rules: Rule[] = [];
      const action: RuleAction = {
        type: chrome.declarativeNetRequest.RuleActionType.ALLOW,
      };
      allowList.forEach((url: string) => {
        id++;
        rules.push({
          id: id,
          priority: 1,
          action,
          condition: {
            urlFilter: url,
            initiatorDomains: [result.url],
            excludedTabIds: [chrome.tabs.TAB_ID_NONE],
          },
        });
      });
      console.debug("add rules", rules);
      const option = {
        addRules: rules,
      };
      // @ts-ignore
      await chrome.declarativeNetRequest.updateSessionRules(option);
      if (tabId) {
        console.log("reload tab", tabId);
        await chrome.tabs.reload(tabId);
      }
    }
  }
};

const _notifyVerifyResult = async (
  tabId: number,
  host: string,
  verifiedResult: VerifiedFirstParty,
  accountState: Required<Pick<AccountState, "encryptedVault" | "dwnSetting">>
) => {
  console.debug("sent to ", tabId);
  const { password } = storedData;
  if (!password) {
    throw new Error("need password re-input");
  }
  const { encryptedVault, dwnSetting } = accountState;
  const keyRing = await ah.unLockKeyRing(encryptedVault, password);
  const issuedPairwiseAccount = await ah.collectPairwiseAccount();
  const newAccount = await am.issuePairwiseAccount(
    keyRing,
    issuedPairwiseAccount.length
  );
  /*
  In background js, can not execute to issue new did request, because bellow error is going to occur.
  It seems `fetch` api that should be available in this environment is not used, caused by browser-polyfill included in `cross-fetch` used in `ion-tools`.

  > asyncHandler.ts:36 ReferenceError: XMLHttpRequest is not defined
  >     at browser-ponyfill.js:462:1
  >     at new Promise (<anonymous>)
  >     at fetch (browser-ponyfill.js:455:1)
  >     at IonProofOfWork.submitIonRequest (index.js:23:1)
  >     at __webpack_modules__.../node_modules/@decentralized-identity/ion-tools/ion.js/lib.js.ION.AnchorRequest.submit (lib.js:94:1)
  >     at _callee$ (ion.ts:39:17)
  >     at tryCatch (ion.ts:2:1)
  >     at Generator.<anonymous> (ion.ts:2:1)
  >     at Generator.next (ion.ts:2:1)
  >     at asyncGeneratorStep (ion.ts:2:1)
   */
  const response = await chrome.tabs.sendMessage(tabId, {
    data: {
      type: "notifyVerifyResult",
      payload: {
        newAccount,
        dwnLocation: dwnSetting.location,
        host,
        verifiedResult,
      },
    },
  });
  console.debug("response from content script", response);

  const result = await ah.syncToDwn(password, "VerificationHistory");
  if (result.type !== "success") {
    console.error(result.reason);
  }
};

const onInstalled = async () => {
  console.debug("onInstalled");
  // https://developer.chrome.com/docs/extensions/mv3/service_workers/#react
  // https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
};

const nonVerificationDomains = ["new-tab-page", "extensions"];
const onBeforeNavigateHandler = async (detail: {
  url: string;
  frameId: number;
  tabId: number;
}) => {
  const { url, frameId, tabId } = detail;
  if (frameId === 0) {
    console.debug("onBeforeNavigateHandler", url, tabId);
    const accountState = await ds.getAccountStatus();
    const { encryptedVault, dwnSetting, adIdSetting } = accountState;
    if (encryptedVault && dwnSetting && adIdSetting) {
      const _url = new URL(url);
      const ctx = await ds.getVerifiedContext(_url.host);
      console.log(_url.host, ctx);
      if (
        !ctx &&
        nonVerificationDomains.find((_domain) =>
          _url.host.startsWith(_domain)
        ) === undefined
      ) {
        storedData.waitVerification = true; // todo isolate flag by tab id or url
        console.debug("waitVerification", storedData.waitVerification);
        const firstPartyResult = await ah.verifyOriginator(url);
        await _setUnBlocker(firstPartyResult, adIdSetting, tabId);
      }
    }
  }
};

const onCompletedHandler = async (detail: {
  url: string;
  frameId: number;
  tabId: number;
}) => {
  const { url, frameId, tabId } = detail;
  if (frameId === 0) {
    console.log("onCompletedHandler", tabId);
    const accountState = await ds.getAccountStatus();
    const { encryptedVault, dwnSetting } = accountState;
    const _url = new URL(url);
    const firstPartyResult = await ds.getVerifiedContext(_url.host);
    console.debug(_url.host);
    console.debug("waitVerification", storedData.waitVerification);
    if (encryptedVault && dwnSetting && firstPartyResult) {
      if (storedData.waitVerification) {
        console.debug("firstPartyResult", firstPartyResult);
        if (firstPartyResult.did) {
          await _notifyVerifyResult(tabId, _url.host, firstPartyResult, {
            encryptedVault,
            dwnSetting,
          });
        } else {
          console.info("did is not found");
        }
        storedData.waitVerification = false;
      }
    }
  }
};

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.webNavigation.onBeforeNavigate.addListener(onBeforeNavigateHandler);
chrome.webNavigation.onCompleted.addListener(onCompletedHandler);

if (!chrome.runtime.onMessage.hasListeners()) {
  // https://developer.chrome.com/docs/extensions/reference/events/#type-Event
  _addEventListeners();
}

(async () => {
  const sessionRules = await chrome.declarativeNetRequest.getSessionRules();
  if (sessionRules.length === 0) {
    await _set3rdPartyBlocker();
    await _restoreBlockingRules();
  }
})();

export {};
