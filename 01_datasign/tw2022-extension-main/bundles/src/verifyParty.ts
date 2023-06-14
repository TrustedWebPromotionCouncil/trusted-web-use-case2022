import { v4 as uuidv4 } from "uuid";
import * as jose from "jose";

import {
  FirstParty,
  OPItem,
  OriginatorProfile,
  OriginatorProfileHolder,
  OriginatorProfileItem,
  Party,
  ProfilesSet,
  VerifiedResult,
  VerifiedResultNG,
  VerifiedResultOK,
  JWTPayload,
  Identifiable,
  Event,
} from "./types";

const jwkKeyUrls: { [key: string]: any } = {}; // todo manage max age
export const verifyParty = async (
  url: string
): Promise<FirstParty<VerifiedResult> & VerifiedResult> => {
  console.debug("verify party");
  const id = uuidv4();
  const date = new Date().toISOString();
  const did = await getDid(url); // todo review which structure is better, string or object.
  const profiles = [];
  const opDocument = await _getOpDocument(url);
  if (opDocument.type === "found") {
    const { publisher, advertiser, profile } = opDocument.body;
    const publishers = publisher ?? [];
    const advertisers = advertiser ?? [];
    for (const token of profile) {
      const profile = await verifyProfile(token);
      console.log("profile---------", profile);
      profiles.push(profile);
    }
    console.log("profiles---------", profiles);
    const firstParty = profiles.find(
      (p) =>
        p.verified === "ok" &&
        p.signedOriginatorProfile.getRole(publishers, advertisers) ===
          "1st_party"
    );
    console.log("firstParty---------", firstParty);
    console.debug("extract third party");
    const thirdParties = await extractThirdParty(
      profiles,
      publishers,
      advertisers
    );
    if (firstParty) {
      const { verified } = firstParty;
      if (verified === "ok" || verified === "ng") {
        const { signedOriginatorProfile } = firstParty;
        const { sub } = signedOriginatorProfile.payload;
        const unmatchedDomain = sub && !sub.includes(new URL(url).host);
        const _ret = { id, date, url, did, thirdParties };
        if (verified === "ok") {
          const originatorProfile =
            signedOriginatorProfile.getOriginatorProfile<OriginatorProfile>();
          const _v = unmatchedDomain ? "unmatched_domain" : verified;
          console.debug("verified ", _v);
          return { ..._ret, verified: _v, originatorProfile };
        } else {
          const originatorProfile =
            signedOriginatorProfile.getOriginatorProfile<JWTPayload>();
          const _v = unmatchedDomain ? "unmatched_domain" : verified;
          console.debug("verified ", _v);
          return { ..._ret, verified: _v, originatorProfile };
        }
      } else {
        const verified = "invalid_op_document";
        return { id, date, url, verified, did };
      }
    } else {
      const verified = "1st_party_not_found";
      return { id, date, url, verified, did };
    }
  } else {
    const verified = "op_document_not_found";
    return { id, date, url, verified, did };
  }
};

const extractThirdParty = async (
  profiles: VerifiedType[],
  publishers: string[],
  advertisers: string[]
): Promise<Party & (VerifiedResultOK | VerifiedResultNG)[]> => {
  return await Promise.all(
    profiles
      .filter(
        (p): p is VerifiedOK | VerifiedNG =>
          p.verified !== "not_verified" &&
          p.signedOriginatorProfile.getRole(publishers, advertisers) ===
            "3rd_party"
      )
      .map(async (p) => {
        const { signedOriginatorProfile, verified } = p;
        const url = signedOriginatorProfile.payload.sub || "";
        const did = await getDid(url);
        if (verified === "ok") {
          return {
            ...p,
            did,
            originatorProfile:
              signedOriginatorProfile.getOriginatorProfile<OriginatorProfile>(),
          };
        } else {
          return {
            ...p,
            did,
            originatorProfile:
              signedOriginatorProfile.getOriginatorProfile<JWTPayload>(),
          };
        }
      })
  );
};

type Role = "1st_party" | "3rd_party" | "other" | "unknown";
export const getHolder = (originatorProfile: OriginatorProfile) => {
  const key = Object.keys(originatorProfile).find((key) => key.endsWith("/op"));
  if (key) {
    const op = originatorProfile[key] as OPItem;
    if (op.item) {
      const { item } = op;
      return Array.isArray(item)
        ? item.find(
            (i: OriginatorProfileItem): i is OriginatorProfileHolder =>
              i.type === "holder"
          )
        : undefined;
    }
  }
  return undefined;
};

class SignedOriginatorProfile {
  readonly verified: boolean;
  readonly payload: OriginatorProfile | JWTPayload;
  constructor(payload: OriginatorProfile | JWTPayload, verified: boolean) {
    this.verified = verified;
    this.payload = payload;
  }
  getOriginatorProfile = <T>() => {
    return this.payload as T;
  };
  getHolder = (): OriginatorProfileHolder | undefined => {
    const _payload = this.payload;
    const key = Object.keys(_payload).find((key) => key.endsWith("/op"));
    if (key) {
      const op: any = _payload[key]; // todo review type
      const item = "item" in op ? op.item : {};
      return Array.isArray(item)
        ? item.find((i: OriginatorProfileItem) => i.type === "holder")
        : undefined;
    }
    return undefined;
  };
  getRole = (publisher: string[], advertiser: string[]): Role => {
    const sub = this.payload.sub ?? "";
    if (publisher.includes(sub)) {
      return "1st_party";
    } else if (advertiser.includes(sub)) {
      return "3rd_party";
    } else {
      return "other";
    }
  };
}
interface InvalidToken extends Identifiable, Pick<Event, "date"> {
  verified: "not_verified";
}
interface VerifiedOK extends Identifiable, Pick<Event, "date"> {
  verified: "ok";
  signedOriginatorProfile: SignedOriginatorProfile;
}
interface VerifiedNG extends Identifiable, Pick<Event, "date"> {
  verified: "ng";
  signedOriginatorProfile: SignedOriginatorProfile;
}
type VerifiedType = InvalidToken | VerifiedOK | VerifiedNG;
export const verifyProfile = async (profile: string): Promise<VerifiedType> => {
  console.debug("verify profile", profile);
  const id = uuidv4();
  const date = new Date().toISOString();
  let claims = undefined;
  try {
    claims = jose.decodeJwt(profile);
  } catch (err) {
    console.error();
    return { verified: "not_verified", id, date };
  }
  let _payload = undefined;
  try {
    const { iss } = claims;
    const jwksUrl = `${iss}/.well-known/jwks.json`;
    if (!(jwksUrl in jwkKeyUrls)) {
      const keyGetFn = jose.createRemoteJWKSet(new URL(jwksUrl));
      jwkKeyUrls[jwksUrl] = keyGetFn;
    }
    const JWKS = jwkKeyUrls[jwksUrl];
    const { payload } = await jose.jwtVerify(profile, JWKS, {
      issuer: iss,
    });
    _payload = payload as unknown as OriginatorProfile;
    const signedOriginatorProfile = new SignedOriginatorProfile(_payload, true);
    return { verified: "ok", signedOriginatorProfile, id, date };
  } catch (err) {
    console.error(err);
    const signedOriginatorProfile = new SignedOriginatorProfile(claims, true);
    return { verified: "ng", signedOriginatorProfile, id, date };
  }
};
export const getDid = async (url: string) => {
  console.debug("get did", url);
  const _url = new URL(url);
  const didUrl = `${_url.protocol}//${_url.host}/.well-known/did.json`;
  try {
    // let response = await fetch(didUrl);
    // let body = await response.json();
    const body = await requestWellKnownRecourse(url, "did.json");
    const { shortForm } = body.did; // todo 階層見直し
    console.info("did", shortForm);
    return shortForm;
  } catch (err) {
    console.info(err);
    return undefined;
  }
};
interface OpDocumentFound {
  type: "found";
  body: ProfilesSet;
}
interface OpDocumentNotFound {
  type: "not found";
}
const _getOpDocument = async (
  url: string
): Promise<OpDocumentFound | OpDocumentNotFound> => {
  console.debug("get op document", url);
  const _url = new URL(url);
  // const opUrl = `${_url.protocol}//${_url.host}/.well-known/op-document`;
  // const response = await fetch(opUrl);
  // const body = await response.json();
  try {
    const body = await requestWellKnownRecourse(url, "op-document");
    return { type: "found", body: body as ProfilesSet };
  } catch (err) {
    return { type: "not found" };
  }
};
export const requestWellKnownRecourse = async (
  url: string,
  resource: string
) => {
  const _url = new URL(url);
  const candidates = [""];
  let path = "";
  for (const dir of _url.pathname.split("/")) {
    if (dir !== "") {
      path = `${path}/${dir}`;
      candidates.push(path);
    }
  }
  for (const path of candidates) {
    const trialUrl = `${_url.protocol}//${_url.host}${path}/.well-known/${resource}`;
    console.log(trialUrl);
    try {
      const res = await fetch(trialUrl);
      if (res.status === 200) {
        return await res.json();
      }
    } catch (err) {
      console.error(err);
    }
  }
  throw new Error(`${resource} under .well-known resource not found `);
};
