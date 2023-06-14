import { getSetting } from "../../src/utils/dataStore";
import { issuePairwiseDid } from "../../bundles/src/asyncHandler";
import {
  OriginatorProfile,
  Party,
  VerifiedFirstParty,
  VerifiedResult,
  VerifiedResultOK,
} from "../../bundles/src/types";
import { getHolder } from "../../bundles/src/verifyParty";
console.log("call content script !!!");

const storedData: {
  [key: string]: {
    address: string;
    privateKeyHex: string;
    dwnLocation: string;
  };
} = {};
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log("onMessage", request);
  if (request.data) {
    const { type, payload } = request.data;
    if (type === "completeChallenge") {
      const { result } = request.data;
      console.debug("result -> " + result);
      const setting = await getSetting();
      const { reCaptchaSiteHost } = setting;
      window.location.href = `${reCaptchaSiteHost}/review/re-captcha/complete?result=${result}`;
    } else if (type === "notifyVerifyResult") {
      console.debug("payload", payload);
      const { newAccount, dwnLocation, host, verifiedResult } = payload;
      const { privateKeyHex, address } = newAccount;
      const { verified, thirdParties } = verifiedResult as VerifiedFirstParty;
      storedData[host] = { address, privateKeyHex, dwnLocation };
      // if all ok then issue pairwise did and post back to background js
      if (
        verified === "ok" &&
        (!thirdParties ||
          thirdParties.filter((p) => p.verified === "ok").length ===
            thirdParties.length)
      ) {
        const newDID = await issuePairwiseDid(privateKeyHex, dwnLocation);
        console.debug("new did", newDID);
        const pairwiseAccount = { ...newDID, address, dwnLocation };
        const _url = new URL(window.location.href);
        const data = {
          type: "sendPersonalData",
          host: _url.host,
          pairwiseAccount,
        };
        const response = await chrome.runtime.sendMessage({ data });
        console.debug("response from background script", response);
        const { originatorProfile } = verifiedResult as VerifiedResultOK;
        const op = _extractOpDocument(originatorProfile, thirdParties);
        popupIfEmailRequired(op);
      } else {
        // show popup UI for asking whether providing or not.
        injectIframe("/ng-popup.html");
      }
    } else if (type === "quitNgPopup") {
      const { adIdUsage, status } = request.data;
      console.debug("status -> " + status);
      console.log("Receive From NG Popup");
      removeIframe();
      if (status === "allow") {
        const host = new URL(window.location.href).host;
        const _storedData = storedData[host];
        console.debug("_storedData, " + _storedData, host, storedData);
        if (_storedData) {
          const { address, privateKeyHex, dwnLocation } = _storedData;
          const newDID = await issuePairwiseDid(privateKeyHex, dwnLocation);
          console.debug("new did", newDID);
          const pairwiseAccount = { ...newDID, address, dwnLocation };
          const _url = new URL(window.location.href);
          const data = {
            type: "sendPersonalData",
            host: _url.host,
            pairwiseAccount,
            adIdUsage,
          };
          const response = await chrome.runtime.sendMessage({ data });
          console.debug("response from background script", response);
        }
      }
    } else if (type === "quitEmailOfferPopup") {
      const { email, status } = request.data;
      console.debug("status -> " + status);
      removeIframe();
      if (status === "allow") {
        const _url = new URL(window.location.href);
        const data = { type: "sendMailAddress", email, host: _url.host };
        const response = await chrome.runtime.sendMessage({ data });
        console.debug("response from background script", response);
      }
    } else if (type === "notifyPairwiseDid") {
      const { didState } = payload;
      window.localStorage.setItem("did", JSON.stringify(didState));
    }
  }
  return true;
});

const _extractOpDocument = (
  originatorProfile: OriginatorProfile,
  thirdParties?: (Party & VerifiedResult)[]
) => {
  const holder = getHolder(originatorProfile);
  const thirdParty =
    (thirdParties &&
      thirdParties
        .filter(
          (result): result is VerifiedResultOK => result.verified === "ok"
        )
        .map((result) => {
          return getHolder(result.originatorProfile);
        })) ||
    [];
  return {
    firstParty: holder,
    thirdParty,
  };
};

const injectIframe = (src: string) => {
  const extensionOrigin = `chrome-extension://${chrome.runtime.id}`;
  if (!location.ancestorOrigins.contains(extensionOrigin)) {
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL(src);
    iframe.className = "ng-popup-iframe";
    iframe.style.cssText = [
      "position:fixed;",
      "top:10px;right:10px;",
      "display:block;",
      "width:386px;",
      "height:394px;",
      "border:0;",
      "box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 4px 6px 0 rgba(50, 50, 93, 0.11);",
      "z-index:999999;",
    ].join("");
    console.log("Inject iframe---------", iframe);
    document.body.appendChild(iframe);
  }
};
const removeIframe = () => {
  const extensionOrigin = `chrome-extension://${chrome.runtime.id}`;
  if (!location.ancestorOrigins.contains(extensionOrigin)) {
    const iframe = document.getElementsByClassName("ng-popup-iframe");
    if (iframe) {
      console.log("Remove iframe---------", iframe);
      document.body.removeChild(iframe[0]);
    }
  }
};
const sendChallengeToken = async (url: URL) => {
  const token = url.searchParams.get("token") ?? "";
  await chrome.runtime.sendMessage({
    data: {
      type: "sendChallengeToken",
      token,
    },
  });
};

const popupIfEmailRequired = (op: object) => {
  const elem = document.querySelector(
    'meta[name="trusted-web:data-requirement"]'
  );
  if (elem) {
    const metaDescription = elem.getAttribute("content");
    console.log(metaDescription);
    if (metaDescription === "email") {
      injectIframe(`/email-popup.html?op=${JSON.stringify(op)}`);
    }
  }
};

const url = new URL(window.location.href);
if (url.pathname === "/review/re-captcha/auth") {
  sendChallengeToken(url).then();
}

export {};
