import { env } from "node:process";
import { DIDResolutionOptions } from "did-resolver";
import { afterEach } from "mocha";
import request from "supertest";
import { assert } from "chai";
import fetchMock from "fetch-mock";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import base64url from "base64url";

import app, { generateExpireDate } from "../app";
import { ionResolver } from "../resolver";
import jwtHandler from "../utils/jwt";
import keys from "../keys";
import ec, { ToJwkArgs } from "../utils/elliptic";
import store, { HolderProfile } from "../store";
import vc from "../verifiable-credentials";

const reCaptchaUrl = process.env.RE_CAPTCHA_VERIFY_SERVER_URL || "";
const fakeDidDocument = (did: string, toJwkArgs: ToJwkArgs) => {
  const publicKeyJwk = ec.toPublicJwk(toJwkArgs);
  console.log({ did, publicKeyJwk });
  return {
    didDocument: {
      id: did,
      verificationMethod: [
        {
          id: "#key-1",
          type: "JsonWebKey2020",
          controller: did,
          publicKeyJwk,
        },
      ],
      authentication: ["#key-1"],
    },
    didDocumentMetadata: {},
    didResolutionMetadata: {},
  };
};

const body = {
  holderProfile: {
    url: "https://xxx.com/",
    name: "string",
    postalCode: "1111111",
    addressCountry: "japan",
    addressRegion: "tokyo",
    addressLocality: "shibuya",
    streetAddress: "1-1-1",
    businessCategory: ["adCompany", "adVerification"],
  },
  expire: 30,
};
const holderInfo1 = {
  holderProfile: {
    name: "value1",
    url: "https://value1.com",
  },
  expire: 30,
};
const holderInfo2 = {
  holderProfile: {
    name: "value2",
    url: "https://value2.com",
  },
  expire: 365,
};
const holderInfo3 = {
  holderProfile: {
    url: "https://publisher.com",
    name: "Publisher Inc.",
    postalCode: "0000000",
    addressCountry: "JP",
    addressRegion: "Tokyo",
    addressLocality: "Shibuya",
    streetAddress: "0-0-0",
    businessCategory: ["media"],
  },
  expire: 365,
};
const certifierInfo = {
  url: "https://certifier.com",
  name: "Certifier Inc.",
  postalCode: "000-0000",
  addressCountry: "JP",
  addressRegion: "Tokyo",
  addressLocality: "Shibuya",
  streetAddress: "0-0-0",
};
const createdAt = new Date("2023-01-25 00:00:00");
const fakeSelectAllHolderProfile: HolderProfile[] = [
  {
    rowid: 3,
    expire: 365,
    profile: JSON.stringify(holderInfo3.holderProfile),
    created_at: createdAt,
  },
  {
    rowid: 2,
    expire: 365,
    profile: JSON.stringify(holderInfo2.holderProfile),
    created_at: createdAt,
  },
  {
    rowid: 1,
    expire: 30,
    profile: JSON.stringify(holderInfo1.holderProfile),
    created_at: createdAt,
  },
];
env.CERTIFIER_INFO = JSON.stringify(certifierInfo);

const appSignKey = [
  {
    id: "key-1",
    key: "7c43fb7cea9a6b2a0b6f97c6c6313c9e067e2933eb45a5101760544874b15790",
  },
];

env.OP_SIGN_KEY = JSON.stringify(appSignKey);
describe("For 3rd party credentials", () => {
  it("get all holders profiles issued ever", async () => {
    const stub = sinon
      .stub(store, "selectALLHolderProfile")
      .callsFake(async () => {
        return fakeSelectAllHolderProfile;
      });
    const response = await request(app.callback()).get(
      "/api/3rd-party/op-list"
    );
    assert.equal(response.status, 200);
    assert.equal(response.header["content-type"], "application/json");
    assert.equal(response.body.length, 3);

    assert.equal(response.body[0].rowid, 3);
    assert.equal(response.body[0].name, holderInfo3.holderProfile.name);
    assert.equal(response.body[0].url, holderInfo3.holderProfile.url);
    assert.equal(response.body[0].issuedAt, generateExpireDate(createdAt, 0));
    assert.equal(
      response.body[0].expire,
      generateExpireDate(createdAt, holderInfo3.expire)
    );

    assert.equal(response.body[1].rowid, 2);
    assert.equal(response.body[1].name, holderInfo2.holderProfile.name);
    assert.equal(response.body[1].url, holderInfo2.holderProfile.url);
    assert.equal(response.body[1].issuedAt, generateExpireDate(createdAt, 0));
    assert.equal(
      response.body[1].expire,
      generateExpireDate(createdAt, holderInfo2.expire)
    );

    assert.equal(response.body[2].rowid, 1);
    assert.equal(response.body[2].name, holderInfo1.holderProfile.name);
    assert.equal(response.body[2].url, holderInfo1.holderProfile.url);
    assert.equal(response.body[0].issuedAt, generateExpireDate(createdAt, 0));
    assert.equal(
      response.body[2].expire,
      generateExpireDate(createdAt, holderInfo1.expire)
    );

    stub.restore();
  });
  it("get all holders profile", async () => {
    const stub = sinon
      .stub(store, "selectHolderProfile")
      .callsFake(async () => {
        return fakeSelectAllHolderProfile[0];
      });

    const response = await request(app.callback()).get("/api/3rd-party/op/3");
    assert.equal(response.status, 200);
    assert.equal(response.header["content-type"], "application/json");
    const result = jwt.decode(response.body, { json: true });
    assert.equal(result?.iss, certifierInfo.url);
    assert.equal(result?.sub, holderInfo3.holderProfile.url);
    const claim = `${certifierInfo.url}/jwt/claims/op`;
    const holderProfile = holderInfo3.holderProfile;
    const credential = {
      type: "credential",
    };
    const certifier = { ...certifierInfo, type: "certifier" };
    const holder = {
      type: "holder",
      url: holderProfile.url,
      name: holderProfile.name,
      postalCode: holderProfile.postalCode,
      addressCountry: holderProfile.addressCountry,
      addressRegion: holderProfile.addressRegion,
      addressLocality: holderProfile.addressLocality,
      streetAddress: holderProfile.streetAddress,
      businessCategory: holderProfile.businessCategory,
    };
    assert.exists(result);
    assert.lengthOf(result?.[claim].item, 3);
    assert.deepInclude(result?.[claim].item, credential);
    assert.deepInclude(result?.[claim].item, certifier);
    assert.deepInclude(result?.[claim].item, holder);

    stub.restore();
  });
  it("get jwks.json", async () => {
    const response = await request(app.callback()).get(
      "/.well-known/jwks.json"
    );
    assert.equal(response.status, 200);
    assert.equal(response.header["content-type"], "application/json");
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].kid, "key-1");
    assert.equal(response.body[0].kty, "EC");
    assert.equal(response.body[0].crv, "secp256k1");
  });
  it("post new holder profile", async () => {
    const response = await request(app.callback())
      .post("/api/3rd-party/op")
      .send(body);
    assert.equal(response.status, 201);
  });

  it("post new holder profile with wrong request body", async () => {
    const response = await request(app.callback())
      .post("/api/3rd-party/op")
      .send({});
    assert.equal(response.status, 400);
  });
  it("revoke a verifiable credential", async () => {
    const response = await request(app.callback()).delete(
      "/api/3rd-party/vc/1"
    );
    assert.equal(response.status, 204);
  });
});

describe("For individual credentials", () => {
  before(async () => {
    await store.createDb();
  });
  after(async () => {
    await store.destroyDb();
  });
  afterEach(() => {
    fetchMock.reset();
  });
  it("get re-captcha site key", async () => {
    env.RE_CAPTCHA_SITE_KEY = "test-site-key";
    const response = await request(app.callback()).get(
      "/api/not-bot/re-captcha-site-key"
    );
    assert.equal(response.status, 200);
    assert.equal(response.header["content-type"], "application/json");
    assert.equal(response.body.reCaptchaSiteKey, "test-site-key");
  });
  it("request with wrong issuer's jwt", async () => {
    fetchMock.post(reCaptchaUrl, { status: 200, body: { success: true } });
    const issuer = "did:ion:123";
    const keyPair = keys.generateKeyPair("secp256k1");
    const wrongIssuer = "did:ion:456";
    const wrongIssuerKeyPair = keys.generateKeyPair("secp256k1");
    // mock did resolver
    const stub = sinon
      .stub(ionResolver, "resolve")
      .callsFake(async (didUrl: string, options: DIDResolutionOptions = {}) => {
        return fakeDidDocument(wrongIssuer, {
          crv: "secp256k1",
          keyPair: wrongIssuerKeyPair,
        });
      });

    const jwt = await jwtHandler.generateJwt(wrongIssuer, keyPair, {
      challenge: "dummy-challenge",
    });
    const response = await request(app.callback())
      .post("/api/not-bot/register")
      .send(`token=${jwt}`);

    const result = await store.selectVerifiedDID(issuer);

    assert.equal(response.status, 400);
    assert.equal(result?.did, undefined);
    stub.restore();
  });

  it("register root did as confirmed as not bot", async () => {
    fetchMock.post(reCaptchaUrl, { status: 200, body: { success: true } });
    const issuer = "did:ion:123";
    // const keyPair = keys.generateKeyPair("secp256k1");
    const keyPair = keys.generateKeyPair();

    // mock did resolver
    const stub = sinon
      .stub(ionResolver, "resolve")
      .callsFake(async (didUrl: string, options: DIDResolutionOptions = {}) => {
        return fakeDidDocument(issuer, { crv: "secp256k1", keyPair });
      });

    const jwt = await jwtHandler.generateJwt(issuer, keyPair, {
      challenge: "dummy-challenge",
    });
    const response = await request(app.callback())
      .post("/api/not-bot/register")
      .send(`token=${jwt}`);

    const result = await store.selectVerifiedDID(issuer);

    assert.equal(response.status, 201);
    assert.equal(result?.did, issuer);
    stub.restore();
  });

  it("issue not bot vc with not registered did", async () => {
    const issuer = "did:ion:123"; // as root did
    const subject = "did:ion:456"; // as sub did

    await store.deleteVerifiedDID(issuer);

    const keyPair = keys.generateKeyPair();

    // mock did resolver
    const stub = sinon
      .stub(ionResolver, "resolve")
      .callsFake(async (didUrl: string, options: DIDResolutionOptions = {}) => {
        return fakeDidDocument(issuer, { crv: "secp256k1", keyPair });
      });

    const jwt = await jwtHandler.generateJwt(issuer, keyPair, {
      sub: subject,
    });
    const response = await request(app.callback())
      .post("/api/not-bot/issue-vc")
      .send(`token=${jwt}`);
    assert.equal(response.status, 400);
    stub.restore();
  });
  it("issue not bot vc", async () => {
    const issuer = "did:ion:123"; // as root did
    const keyPair1 = keys.generateKeyPair();
    const subject = "did:ion:456"; // as sub did

    await store.insertVerifiedDID(issuer); // as verified not bot did

    const keyPair2 = keys.generateKeyPair("secp256k1");
    const d = base64url.encode(
      keyPair2.getPrivate().toArrayLike(Buffer, "be", 32)
    );
    env.APP_SIGN_KEY = d;
    const didApp = process.env.APP_SIGN_DID!;
    // mock did resolver
    const stub = sinon.stub(ionResolver, "resolve");
    // for resolving root did
    const jwkArg1: ToJwkArgs = { crv: "secp256k1", keyPair: keyPair1 };
    stub.onCall(0).returns(Promise.resolve(fakeDidDocument(issuer, jwkArg1)));
    // for resolving own app did(called in this test code when just before assertion)
    const jwkArg2: ToJwkArgs = { crv: "secp256k1", keyPair: keyPair2 };
    stub.onCall(1).returns(Promise.resolve(fakeDidDocument(didApp, jwkArg2)));

    const jwt = await jwtHandler.generateJwt(issuer, keyPair1, {
      sub: subject,
    });
    const response = await request(app.callback())
      .post("/api/not-bot/issue-vc")
      .send(`token=${jwt}`);
    assert.equal(response.status, 201);
    const body = response.body;
    const { notBotVC } = body;
    const result = await vc.verifyVC(notBotVC);
    const { credentialSubject } = result;

    assert.equal(credentialSubject.name, "re-captcha-test");
    assert.equal(credentialSubject.agent.name, subject);
    assert.equal(credentialSubject.result, true);
    stub.restore();
  });
});
