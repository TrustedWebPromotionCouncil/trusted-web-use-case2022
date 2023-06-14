/**
 * @jest-environment ./jest-custom-environment
 */
import ec from "./elliptic";

const privateKeyHex =
  "7c43fb7cea9a6b2a0b6f97c6c6313c9e067e2933eb45a5101760544874b15790";
describe("key pair test", () => {
  test("sign and verify [secp256k1]", async () => {
    const privateJwk = ec.privateKeyHexToJwk(privateKeyHex);
    const jws = await ec.sighJws("test payload", privateJwk);
    const { d, ...rest } = privateJwk;
    const publicJwk = { ...rest };
    const result = await ec.verifyJws(jws, publicJwk);
    expect(result).toBeTruthy();
  });
  test("sign and verify [Ed25519]", async () => {
    const privateJwk = ec.privateKeyHexToJwk(privateKeyHex, {
      kty: "OKP",
      crv: "Ed25519",
    });
    const jws = await ec.sighJws("test payload", privateJwk);
    const { d, ...rest } = privateJwk;
    const publicJwk = { ...rest };
    const result = await ec.verifyJws(jws, publicJwk);
    expect(result).toBeTruthy();
  });
});
