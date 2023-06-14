import { date } from "yup";

export interface Identifiable {
  id: string;
}
/**
 * JWT
 *
 * @see [RFC7519#section-4.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1)
 */
export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
  nbf?: number;
  exp?: number;
  iat?: number;
  /** Any other JWT Claim Set member. */
  [propName: string]: unknown;
}

export type BusinessCategory =
  | "adCompany"
  | "advertiser"
  | "dsp"
  | "ssp"
  | "adNetwork"
  | "adExchange"
  | "media"
  | "adVerification"
  | "analytics";

export interface OriginatorProfileCertifier {
  type: "certifier";
  name: string;
  url: string;
}
export interface OriginatorProfileCredential {
  type: "credential";
}
export interface OriginatorProfileHolder {
  type: "holder";
  name: string;
  url: string;
  businessCategory?: BusinessCategory[];
}

export type OriginatorProfileItem =
  | OriginatorProfileHolder
  | OriginatorProfileCertifier
  | OriginatorProfileCredential;
export interface OPItem {
  item: OriginatorProfileItem[];
}
export interface OriginatorProfileItems {
  [key: string]: OPItem | string;
}
export interface OriginatorProfileHeader {
  iss: string;
  sub: string;
}
export type OriginatorProfile = OriginatorProfileHeader &
  OriginatorProfileItems;

export interface ProfilesSet {
  "@context": string;
  main?: string[];
  publisher?: string[];
  advertiser?: string[];
  profile: string[];
}
export interface Party {
  did?: string;
}
export interface FirstParty<T = {}> extends Party {
  url: string;
  thirdParties?: (Party & T)[];
}

export interface Event {
  name: string;
  date: string;
}
export interface VerifiedResultOK extends Identifiable, Pick<Event, "date"> {
  verified: "ok";
  originatorProfile: OriginatorProfile;
}
export interface VerifiedResultNG extends Identifiable, Pick<Event, "date"> {
  verified: "ng";
  originatorProfile: JWTPayload;
}
export interface VerifiedResultUnmatchedDomain
  extends Identifiable,
    Pick<Event, "date"> {
  verified: "unmatched_domain";
  originatorProfile: OriginatorProfile | JWTPayload;
}
export type VerifiedResultHasOpDoc =
  | VerifiedResultOK
  | VerifiedResultNG
  | VerifiedResultUnmatchedDomain;
export interface VerifiedResultOther extends Identifiable, Pick<Event, "date"> {
  verified:
    | "invalid_op_document"
    | "op_document_not_found"
    | "1st_party_not_found";
}
export type VerifiedResult = VerifiedResultHasOpDoc | VerifiedResultOther;

export interface VerifiedContext {
  [key: string]: FirstParty<VerifiedResult> & VerifiedResult;
}

export interface ConsentedToProvide {
  consentToProvide: boolean;
}

export type Providable = ConsentedToProvide & VerifiedResultHasOpDoc;
export type VerifiedFirstParty = FirstParty<VerifiedResult> & VerifiedResult;
export type ProvidableFirstParty = FirstParty<Providable> & Providable;
