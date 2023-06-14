/**
 * @jest-environment ./jest-custom-environment
 */
import fetchMock from "fetch-mock";
import { v4 as uuidv4 } from "uuid";
import didJWT, { ES256KSigner, hexToBytes } from "did-jwt";
import { Issuer, verifyCredential, verifyPresentation } from "did-jwt-vc";
import {
  DIDResolver,
  DIDResolutionResult,
  ParsedDID,
  Resolver,
} from "did-resolver";

import {
  generateDid,
  generateIssuablePerson,
  generateVerifiablePerson,
  generateDidDocument,
} from "../test/fixtures";
import {
  registerNotBotDID,
  issueNotBotVC,
  determineAdId,
  makeVc,
  makeVp,
  DeterminedAdId,
} from "./personalData";
import { AdIdSetting } from "../../src/store/types";
import { IssuablePerson, VerifiablePerson } from "../../src/utils/types";
import elliptic from "../../src/keys/elliptic";

describe("not bot vc", () => {
  test("request to register not vc did", async () => {
    const authorityHost = "https://api.re-capthca.example.com";
    const authorityUrl = `${authorityHost}/api/not-bot/register`;
    fetchMock.post(authorityUrl, {
      status: 201,
      body: {},
    });
    const account = await generateIssuablePerson();
    await registerNotBotDID(account, "dummy-challenge", authorityHost);
    expect(fetchMock.called(authorityUrl)).toBe(true);
    fetchMock.restore();
  });
  test("request to issue not vc", async () => {
    const account = await generateIssuablePerson();
    const authorityKeyPair = elliptic.genKeyPair();
    const privateKeyHex = authorityKeyPair.getPrivate("hex");
    const signer = ES256KSigner(hexToBytes(privateKeyHex));
    let jwt = await didJWT.createJWT(
      {
        name: "not bot challenge",
        agent: { name: account.didState.longForm },
        result: true,
      },
      { issuer: "dummy-issuer", signer },
      { alg: "ES256K" }
    );
    const authorityHost = "https://api.re-capthca.example.com";
    const authorityUrl = `${authorityHost}/api/not-bot/issue-vc`;
    fetchMock.post(authorityUrl, {
      status: 201,
      body: {
        notBotVC: jwt,
      },
    });
    const ret = await issueNotBotVC(
      account,
      generateDid().longForm,
      authorityHost
    );
    const { payload, vc } = ret;
    expect(vc).toBeTruthy();
    expect(payload.name).toBe("not bot challenge");
    expect(payload.agent.name).toBe(account.didState.longForm);
    expect(payload.result).toBe(true);
    expect(fetchMock.called(authorityUrl)).toBe(true);
    fetchMock.restore();
  });
});
describe("ad id", () => {
  test("setting is global(1st time)", async () => {
    const providedHistories = { globalAdId: "", histories: [] };
    const adIdSetting: AdIdSetting = {
      scope: "global",
      usage: ["advertiser"],
    };
    const ret = determineAdId(providedHistories, adIdSetting);
    expect(ret.issued).toBe(true);
    expect(ret.id).toBeTruthy();
    expect(ret.usage).toEqual(["advertiser"]);
  });
  test("setting is global(2nd time)", async () => {
    const globalAdId = uuidv4();
    const providedHistories = { globalAdId, histories: [] };
    const adIdSetting: AdIdSetting = {
      scope: "global",
      usage: ["analytics"],
    };
    const ret = determineAdId(providedHistories, adIdSetting);
    expect(ret.issued).toBe(false);
    expect(ret.id).toBe(globalAdId);
    expect(ret.usage).toEqual(["analytics"]);
  });
  test("setting is by-1st-party", async () => {
    const globalAdId = uuidv4();
    const providedHistories = { globalAdId, histories: [] };
    const adIdSetting: AdIdSetting = {
      scope: "by_1st_party",
      usage: ["advertiser"],
    };
    const ret = determineAdId(providedHistories, adIdSetting);
    expect(ret.issued).toBe(true);
    expect(ret.id).not.toBe(globalAdId);
    expect(ret.id).toBeTruthy();
    expect(ret.usage).toEqual(["advertiser"]);
  });
});
export function getResolver(
  person: VerifiablePerson
): Record<string, DIDResolver> {
  async function resolve(
    did: string,
    parsed: ParsedDID
  ): Promise<DIDResolutionResult> {
    const response = generateDidDocument(person);
    return response;
  }
  return { ion: resolve };
}

const adId: DeterminedAdId = {
  issued: true,
  id: uuidv4(),
  usage: ["advertiser"],
};
describe("verifiable credentials", () => {
  let issuablePerson: IssuablePerson;
  let person: VerifiablePerson;
  let person2: VerifiablePerson;
  let resolver: Resolver;
  let resolver2: Resolver;
  let vc: { vcJwt: string; issuer: Issuer };
  beforeAll(async () => {
    issuablePerson = await generateIssuablePerson();
    person = await generateVerifiablePerson({ issuablePerson });
    person2 = await generateVerifiablePerson();
    resolver = new Resolver(getResolver(person));
    resolver2 = new Resolver(getResolver(person2));
    vc = await makeVc(issuablePerson, { adId });
  });
  // https://github.com/decentralized-identity/did-jwt
  // https://github.com/decentralized-identity/did-jwt-vc#verifying-a-verifiable-credential
  test("make vc", async () => {
    const { vcJwt, issuer } = vc;
    expect(vcJwt).toBeTruthy();
    expect(issuer.did).toBe(person.didState.longForm);
    let decoded = didJWT.decodeJWT(vcJwt);
    expect(decoded.payload.sub).toBe(person.didState.longForm);
    expect(decoded.payload.vc.credentialSubject.adId.id).toBe(adId.id);
    expect(decoded.payload.vc.credentialSubject.adId.usage).toEqual(adId.usage);
    const verifiedVC = await verifyCredential(vcJwt, resolver);
    expect(verifiedVC.verified).toBe(true);
  });
  test("make vc(validate using another persons did)", async () => {
    const { vcJwt, issuer } = vc;
    expect(vcJwt).toBeTruthy();
    expect(issuer.did).toBe(person.didState.longForm);
    let decoded = didJWT.decodeJWT(vcJwt);
    expect(decoded.payload.sub).toBe(person.didState.longForm);
    expect(decoded.payload.vc.credentialSubject.adId.id).toBe(adId.id);
    expect(decoded.payload.vc.credentialSubject.adId.usage).toEqual(adId.usage);
    // resolve to another did
    await expect(verifyCredential(vcJwt, resolver2)).rejects.toThrow(
      "invalid_signature: Signature invalid for JWT"
    );
  });
});
describe("verifiable presentation(test vp including multiple issuer's vc)", () => {
  // https://www.w3.org/TR/vc-data-model/#presentations-0
  // https://www.w3.org/TR/vc-data-model/#dfn-presentations
  // > Data derived from one or more verifiable credentials, issued by one or more issuers, that is shared with a specific verifier.
  let issuablePerson: IssuablePerson;
  let issuablePerson2: IssuablePerson;
  let person: VerifiablePerson;
  let person2: VerifiablePerson;
  let resolver: Resolver;
  let resolver2: Resolver;
  let vc: { vcJwt: string; issuer: Issuer };
  beforeAll(async () => {
    issuablePerson = await generateIssuablePerson();
    issuablePerson2 = await generateIssuablePerson();
    person = await generateVerifiablePerson({ issuablePerson });
    person2 = await generateVerifiablePerson({
      issuablePerson: issuablePerson2,
    });
    resolver = new Resolver(getResolver(person));
    resolver2 = new Resolver(getResolver(person2));
    vc = await makeVc(issuablePerson, adId);
  });
  test("make vp issued by person1", async () => {
    const vc1 = await makeVc(issuablePerson, adId);
    const vc2 = await makeVc(issuablePerson2, adId);
    const vpJwt = await makeVp([vc1.vcJwt, vc2.vcJwt], vc1.issuer);
    expect(vpJwt).toBeTruthy();
    const verifiedVP = await verifyPresentation(vpJwt, resolver);
    console.log(verifiedVP);
    expect(verifiedVP.verified).toBe(true);
    const { verifiablePresentation } = verifiedVP;
    if (verifiablePresentation && verifiablePresentation.verifiableCredential) {
      const { verifiableCredential } = verifiablePresentation;
      expect(verifiableCredential.length).toBe(2);
      expect(verifiableCredential[0].issuer.id).toBe(person.didState.longForm);
      expect(verifiableCredential[0].proof.jwt).toBe(vc1.vcJwt);
      expect(verifiableCredential[1].issuer.id).toBe(person2.didState.longForm);
      expect(verifiableCredential[1].proof.jwt).toBe(vc2.vcJwt);
      console.log(
        verifiablePresentation!.verifiableCredential![0].credentialSubject
      );
    } else {
      throw new Error("failed");
    }
  });
  test("make vp issued by person2", async () => {
    const vc1 = await makeVc(issuablePerson, adId);
    const vc2 = await makeVc(issuablePerson2, adId);
    const vpJwt = await makeVp([vc1.vcJwt, vc2.vcJwt], vc2.issuer);
    expect(vpJwt).toBeTruthy();
    const verifiedVP = await verifyPresentation(vpJwt, resolver2);
    console.log(verifiedVP);
    expect(verifiedVP.verified).toBe(true);
    const { verifiablePresentation } = verifiedVP;
    if (verifiablePresentation && verifiablePresentation.verifiableCredential) {
      const { verifiableCredential } = verifiablePresentation;
      expect(verifiableCredential.length).toBe(2);
      expect(verifiableCredential[0].issuer.id).toBe(person.didState.longForm);
      expect(verifiableCredential[0].proof.jwt).toBe(vc1.vcJwt);
      expect(verifiableCredential[1].issuer.id).toBe(person2.didState.longForm);
      expect(verifiableCredential[1].proof.jwt).toBe(vc2.vcJwt);
      console.log(
        verifiablePresentation!.verifiableCredential![0].credentialSubject
      );
    } else {
      throw new Error("failed");
    }
  });
});
