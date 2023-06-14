/**
 * @jest-environment ./jest-custom-environment
 */
import ec from "./elliptic";
import { sign, verify } from "@decentralized-identity/ion-tools";
import { assert } from "chai";

export const privateKeyHex =
  "7c43fb7cea9a6b2a0b6f97c6c6313c9e067e2933eb45a5101760544874b15790";

describe("elliptic test", () => {
  it("sign and verify [secp256k1]", async () => {
    const keyPair = ec.privateKeyToECKeyPair(privateKeyHex, "secp256k1");
    const privateJwk = ec.toPrivateJwk({ crv: "secp256k1", keyPair });
    const jws = await sign({ payload: "test payload", privateJwk });
    const { d, ...rest } = privateJwk;
    const publicJwk = { ...rest };
    const result = await verify({ jws, publicJwk });
    assert.isTrue(result);
  });
  it("sign and verify [Ed25519]", async () => {
    const keyPair = ec.privateKeyToEdDSAKeyPair(privateKeyHex);
    const privateJwk = ec.toPrivateJwk({ crv: "Ed25519", keyPair });
    const jws = await sign({ payload: "test payload", privateJwk });
    const { d, ...rest } = privateJwk;
    const publicJwk = { ...rest };
    const result = await verify({ jws, publicJwk });
    assert.isTrue(result);
  });
});
