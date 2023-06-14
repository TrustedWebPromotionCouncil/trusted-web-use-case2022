/**
 * @jest-environment ./jest-custom-environment
 */
import { assert } from "chai";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import keys from "../keys";
import { tokenProfile } from "./jwt";
import { sign, verify } from "@decentralized-identity/ion-tools";

const appSignKeyList = [
  {
    id: "key-1",
    key: "7c43fb7cea9a6b2a0b6f97c6c6313c9e067e2933eb45a5101760544874b15790",
  },
];
const issuerUrl = "https://issuer.com";
const claim = `${issuerUrl}/jwt/claims/op`;
const op = {
  [claim]: {
    item: [
      {
        type: "credential",
      },
      {
        type: "certifier",
      },
      {
        type: "holder",
      },
    ],
  },
  iss: issuerUrl,
  sub: "https://subject.com",
  iat: 1665726894,
  exp: 1697262894,
};

describe("jwt test", () => {
  it("test tokenProfile", async () => {
    const privateKey = keys.getPrivateById("key-1", appSignKeyList);
    const privateKeyPem = keys.getPrivateKeyPem(privateKey!.key, "P-256");
    const privateJwk = keys.privateKeyHexToJwk(privateKey!.key, "P-256");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const publicKeyPem = jwkToPem(privateJwk, { private: false });
    const keyId = "key-1";
    const signedJwt = tokenProfile(op, keyId, privateKeyPem);
    const result = jwt.verify(signedJwt, publicKeyPem, {
      complete: true,
    });
    assert.equal(result.header.alg, "ES256");
    assert.equal(result.header.typ, "JWT");
    assert.equal(result.header.kid, keyId);
    const profile: any = result.payload;
    assert.deepInclude(profile[claim].item, { type: "credential" });
    assert.deepInclude(profile[claim].item, { type: "certifier" });
    assert.deepInclude(profile[claim].item, { type: "holder" });
  });
  it("test tokenProfile verify with wrong pubKey", async () => {
    const privateKey = keys.getPrivateById("key-1", appSignKeyList);
    const privateKeyPem = keys.getPrivateKeyPem(privateKey!.key, "P-256");
    const wrongKeyPair = keys.generateKeyPair("P-256");
    const wrongPubJwk = keys.keyPairToJwk({
      crv: "P-256",
      keyPair: wrongKeyPair,
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const wrongPubPem = jwkToPem(wrongPubJwk, { private: false });
    const keyId = "key-1";
    const signedJwt = tokenProfile(op, keyId, privateKeyPem);

    try {
      jwt.verify(signedJwt, wrongPubPem, {
        complete: true,
      });
    } catch (error) {
      assert.equal(error, "JsonWebTokenError: invalid signature");
    }
  });
  // it("test getPublicJwk", async () => {
  //   const privateKey = keys.getPrivateById("key-1", appSignKeyList);
  //   const publicJwks = keys.getPublicJwks(appSignKeyList);
  //   const publicJwk = publicJwks[0];
  //   const privateJwk = keys.privateKeyHexToJwk(privateKey!.key, "secp256k1");
  //   const jws = await sign({ payload: "test payload", privateJwk });
  //   const result = await verify({ jws, publicJwk });
  //   assert.isTrue(result);
  // });
});
