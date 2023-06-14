import {
  ES256KSigner,
  createJWT,
  hexToBytes,
  decodeJWT,
  JWTPayload,
} from "did-jwt";
import {
  Issuer,
  JwtCredentialPayload,
  JwtPresentationPayload,
  createVerifiableCredentialJwt,
  createVerifiablePresentationJwt,
} from "did-jwt-vc";
import { v4 as uuidv4 } from "uuid";

import { IssuablePerson } from "../../src/utils/types";
import { Party, Providable } from "./types";
import {
  AdUsage,
  AdIdSetting,
  ProvidedHistories,
  ProvidedHistory,
} from "../../src/store/types";

export const registerNotBotDID = async (
  account: Omit<IssuablePerson, "dwnLocation">,
  challenge: string,
  notBotAuthorityHost: string
) => {
  const { didState, privateKeyHex } = account;
  const signer = ES256KSigner(hexToBytes(privateKeyHex));

  const jwt = await createJWT(
    {
      challenge,
    },
    { issuer: didState.longForm, signer },
    { alg: "ES256K" }
  );

  const url = `${notBotAuthorityHost}/api/not-bot/register`;
  const opt = {
    method: "post",
    body: `token=${jwt}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  try {
    const response = await fetch(url, opt);
    const { status, statusText } = response;
    if (status === 201) {
      const body = await response.json();
      return body;
    } else {
      throw new Error(`status: ${status}, statusText:${statusText}`);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const issueNotBotVC = async (
  account: Omit<IssuablePerson, "dwnLocation">,
  sub: string,
  notBotAuthorityHost: string
) => {
  const { didState, privateKeyHex } = account;
  const signer = ES256KSigner(hexToBytes(privateKeyHex));

  const jwt = await createJWT(
    {
      iss: didState.longForm,
      sub: sub,
    },
    { issuer: didState.longForm, signer },
    { alg: "ES256K" }
  );

  const url = `${notBotAuthorityHost}/api/not-bot/issue-vc`;
  const opt = {
    method: "post",
    body: `token=${jwt}`,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  try {
    const response = await fetch(url, opt);
    const { status, statusText } = response;
    if (status === 201) {
      const body = await response.json();
      const vc = body.notBotVC;
      const decoded = decodeJWT(vc);
      return {
        payload: decoded.payload,
        vc,
      };
    } else {
      throw new Error(`status: ${status}, statusText:${statusText}`);
    }
  } catch (err) {
    console.error(err);
    console.error("jwt:", jwt);
    throw err;
  }
};

export interface DeterminedAdId {
  issued: boolean;
  id: string;
  usage: AdUsage[];
}
/*
  |                 | ad id global | ad id by 1st party |
  | --------------- | ------------ | ------------------ |
  | did:ion:1       |              |                    |
  | 1st-party-1.com | ad1          | ad1                |
  | 3rd-party-1.com | ad1          | ad1                |
  | 3rd-party-2.com | ad1          | ad1                |
  |                 |              |                    |
  | did:ion:2       |              |                    |
  | 1st-party-2.com | ad1          | ad2                |
  | 3rd-party-1.com | ad1          | ad2                |
  | 3rd-party-2.com | ad1          | ad2                |
   */
export const determineAdId = (
  providedHistories: ProvidedHistories,
  adIdSetting: AdIdSetting
): DeterminedAdId => {
  const { globalAdId } = providedHistories;
  const { scope, usage } = adIdSetting;
  if (scope === "global") {
    const issued = globalAdId === "";
    const adId = issued ? uuidv4() : globalAdId;
    return { issued, id: adId, usage };
  } else {
    return { issued: true, id: uuidv4(), usage };
  }
};

export const makeVc = async (
  pairwiseAccount: Pick<IssuablePerson, "didState" | "privateKeyHex">,
  credentialSubject: {}
) => {
  const { didState, privateKeyHex } = pairwiseAccount;
  const issuerId = didState.longForm;
  const alg = "ES256K";
  const signer = ES256KSigner(hexToBytes(privateKeyHex));
  const issuer: Issuer = {
    did: issuerId,
    alg,
    signer,
  };
  const vcPayload: JwtCredentialPayload = {
    sub: didState.longForm,
    // nbf: a UNIX timestamp when this VC is issued
    nbf: Math.floor(new Date().getTime() / 1000),
    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://schema.org",
      ],
      type: ["VerifiableCredential"],
      credentialSubject,
    },
  };
  const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
  return { vcJwt, issuer };
};

export const makeVp = async (vcJwts: string[], issuer: Issuer) => {
  const vpPayload: JwtPresentationPayload = {
    vp: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiablePresentation"],
      verifiableCredential: vcJwts,
    },
  };

  return await createVerifiablePresentationJwt(vpPayload, issuer);
};

export const makeHistory = (
  party: Required<Party> & Providable,
  createdAt: string,
  data: {
    notBot?: JWTPayload;
    adId?: DeterminedAdId;
    mailAddress?: string;
  }
): ProvidedHistory => {
  const { did, consentToProvide, originatorProfile } = party;
  const url = originatorProfile.sub || "";
  const { notBot, adId, mailAddress } = data;
  const h = {
    did,
    url,
    domain: (url && new URL(url).host) || "",
    provided: consentToProvide,
    createdAt,
  };
  let his: ProvidedHistory = { ...h };
  if (notBot) {
    his = {
      ...his,
      notBot: notBot.vc.credentialSubject as {
        name: string;
        agent: { name: string };
        result: boolean;
      },
    };
  }
  if (adId) {
    his = { ...his, adId };
  }
  if (mailAddress) {
    his = { ...his, mailAddress };
  }
  return his;
};

export default {
  issueNotBotVC,
  determineAdId,
  makeVp,
  makeVc,
  makeHistory,
};
