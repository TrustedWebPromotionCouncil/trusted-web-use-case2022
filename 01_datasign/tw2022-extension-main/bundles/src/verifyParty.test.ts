import {
  authority,
  authorityPublicJwk,
  generateOriginatorProfileCertifier,
  generateOriginatorProfileHolder,
  generateProfile,
  generateProfilesSet,
} from "../test/fixtures";
import nock from "nock";
import fetchMock from "fetch-mock";
import {
  requestWellKnownRecourse,
  verifyParty,
  verifyProfile,
} from "./verifyParty";
import { VerifiedResultOK } from "./types";

describe("verify op document", () => {
  const iss = authority;
  const certifier = generateOriginatorProfileCertifier();
  const publisher = generateOriginatorProfileHolder({
    businessCategory: ["media"],
  });
  const advertiser = generateOriginatorProfileHolder({
    businessCategory: ["advertiser"],
  });
  const analytics = generateOriginatorProfileHolder({
    businessCategory: ["analytics"],
  });
  const profile1 = generateProfile(iss, [certifier, publisher]);
  const profile2 = generateProfile(iss, [certifier, advertiser]);
  const profile3 = generateProfile(iss, [certifier, analytics]);
  const publishers = [profile1.profile.sub];
  const advertisers = [profile2.profile.sub, profile3.profile.sub];
  const profilesSet = generateProfilesSet(
    [profile1.token, profile2.token, profile3.token],
    {
      publisher: publishers,
      advertiser: advertisers,
    }
  );
  beforeAll(async () => {
    // https://www.npmjs.com/package/nock
    // https://github.com/panva/jose/blob/main/test/jwks/remote.test.mjs
    const jwks = { keys: [{ ...authorityPublicJwk, kid: "key-1" }] };
    nock(authority).get("/.well-known/jwks.json").reply(200, jwks).persist();
  });

  test("test1", async () => {
    const ret = await verifyProfile(profile1.token);
    if (ret.verified === "ok") {
      const { signedOriginatorProfile } = ret;
      expect(signedOriginatorProfile.verified).toBe(true);
      expect(signedOriginatorProfile.getRole(publishers, advertisers)).toBe(
        "1st_party"
      );
      expect(signedOriginatorProfile.payload.sub).toBe(profile1.profile.sub);
      expect(signedOriginatorProfile.getHolder()!.businessCategory).toEqual(
        publisher.businessCategory
      );
    } else {
      throw new Error("failed");
    }
  });
  test("test2", async () => {
    const ret = await verifyProfile(profile2.token);
    if (ret.verified === "ok") {
      const { signedOriginatorProfile } = ret;
      expect(signedOriginatorProfile.verified).toBe(true);
      expect(signedOriginatorProfile.getRole(publishers, advertisers)).toBe(
        "3rd_party"
      );
      expect(signedOriginatorProfile.payload.sub).toBe(profile2.profile.sub);
      expect(signedOriginatorProfile.getHolder()!.businessCategory).toEqual(
        advertiser.businessCategory
      );
    } else {
      throw new Error("failed");
    }
  });
  test("test3", async () => {
    const ret = await verifyProfile(profile3.token);
    if (ret.verified === "ok") {
      const { signedOriginatorProfile } = ret;
      expect(signedOriginatorProfile.verified).toBe(true);
      expect(signedOriginatorProfile.getRole(publishers, advertisers)).toBe(
        "3rd_party"
      );
      expect(signedOriginatorProfile.payload.sub).toBe(profile3.profile.sub);
      expect(signedOriginatorProfile.getHolder()!.businessCategory).toEqual(
        analytics.businessCategory
      );
    } else {
      throw new Error("failed");
    }
  });
  test("valid 1st-party", async () => {
    const url = profile1.profile.sub;
    const didUrl = `${url}/.well-known/did.json`;
    const opUrl = `${url}/.well-known/op-document`;
    fetchMock.get(didUrl, {
      status: 200,
      body: {
        did: { longForm: "did:ion:123.xxx", shortForm: "did:ion:123" },
      },
    });

    fetchMock.get(opUrl, {
      status: 200,
      body: profilesSet,
    });
    const result = await verifyParty(url);
    if (result.verified === "ok") {
      const { did, originatorProfile, thirdParties } = result;
      expect(did).toBe("did:ion:123");
      expect(originatorProfile!.iss).toBe(authority);
      expect(originatorProfile!.sub).toBe(profile1.profile.sub);
      expect(thirdParties).toBeTruthy();
      expect(thirdParties!.length).toBe(2);
      const p1 = thirdParties![0] as VerifiedResultOK;
      expect(p1.originatorProfile!.iss).toBe(authority);
      expect(p1.originatorProfile!.sub).toBe(profile2.profile.sub);
      const p2 = thirdParties![1] as VerifiedResultOK;
      expect(p2.originatorProfile!.iss).toBe(authority);
      expect(p2.originatorProfile!.sub).toBe(profile3.profile.sub);
    } else {
      throw new Error("reached unexpected path!");
    }
  });
  test("invalid 1st-party", async () => {
    const url = "https://evilsite.com";
    const didUrl = `${url}/.well-known/did.json`;
    const opUrl = `${url}/.well-known/op-document`;
    fetchMock.get(didUrl, {
      status: 200,
      body: {
        did: { longForm: "did:ion:123.xxx", shortForm: "did:ion:123" },
      },
    });

    fetchMock.get(opUrl, {
      status: 200,
      body: profilesSet,
    });
    const result = await verifyParty(url);
    if (result.verified === "unmatched_domain") {
      const { did, originatorProfile, thirdParties } = result;
      expect(did).toBe("did:ion:123");
      expect(originatorProfile!.iss).toBe(authority);
      expect(originatorProfile!.sub).toBe(profile1.profile.sub);
      expect(thirdParties).toBeTruthy();
      expect(thirdParties!.length).toBe(2);
      const p1 = thirdParties![0] as VerifiedResultOK;
      expect(p1.originatorProfile!.iss).toBe(authority);
      expect(p1.originatorProfile!.sub).toBe(profile2.profile.sub);
      const p2 = thirdParties![1] as VerifiedResultOK;
      expect(p2.originatorProfile!.iss).toBe(authority);
      expect(p2.originatorProfile!.sub).toBe(profile3.profile.sub);
    } else {
      throw new Error("reached unexpected path!");
    }
  });
});

describe(".well-known resources", () => {
  const host = "https://s3.ap-northeast-1.amazonaws.com";
  const path = "/static.did-siop.develop.bunsin.io/1st-party/index.html";
  const path1 = "/static.did-siop.develop.bunsin.io";
  const path2 = "/static.did-siop.develop.bunsin.io/1st-party";
  const responsePayload = {
    did: { longForm: "did:ion:456.xxx", shortForm: "did:ion:456" },
  };
  afterEach(() => {
    fetchMock.restore();
  });
  test("1", async () => {
    const wellKnownPath = `${host}/.well-known/did.json`;
    fetchMock.get(wellKnownPath, {
      status: 200,
      body: responsePayload,
    });
    const url = host + path;
    const res = await requestWellKnownRecourse(url, "did.json");
    expect(res.did.shortForm).toBe("did:ion:456");
  });
  test("2", async () => {
    const wellKnownPath = `${host + path1}/.well-known/did.json`;
    fetchMock.get(wellKnownPath, {
      status: 200,
      body: responsePayload,
    });
    const url = host + path;
    const res = await requestWellKnownRecourse(url, "did.json");
    expect(res.did.shortForm).toBe("did:ion:456");
  });
  test("3", async () => {
    const wellKnownPath = `${host + path2}/.well-known/did.json`;
    fetchMock.get(wellKnownPath, {
      status: 200,
      body: responsePayload,
    });
    const url = host + path;
    const res = await requestWellKnownRecourse(url, "did.json");
    expect(res.did.shortForm).toBe("did:ion:456");
  });
  test("4", async () => {
    const wellKnownPath = `${host + path}/.well-known/did.json`;
    fetchMock.get(wellKnownPath, {
      status: 404,
    });
    const url = host + path;
    await expect(requestWellKnownRecourse(url, "did.json")).rejects.toThrow();
  });
});
