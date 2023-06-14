import { ec as EC, eddsa as EdDSA } from "elliptic";
import base64url from "base64url";
import ION from "@decentralized-identity/ion-tools";

import { CRV, PublicJwk } from "./types";

// https://github.com/indutny/elliptic#supported-curves
const curveNameMap: { [key in CRV]: string } = {
  secp256k1: "secp256k1",
  Ed25519: "ed25519",
  "P-256": "p256",
};

const genKeyPair = () => {
  const ec = new EC("secp256k1");
  const key = ec.genKeyPair();
  return key;
};

const sighJws = async (payload: any, privateJwk: PublicJwk) => {
  const jws = await ION.signJws({ payload, privateJwk });
  return jws;
};

const verifyJws = async (jws: string, publicJwk: PublicJwk) => {
  try {
    await ION.verifyJws({ jws, publicJwk });
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const privateKeyHexToJwk = (
  privateKeyHex: string,
  opt: Pick<PublicJwk, "kty" | "crv"> = { kty: "EC", crv: "secp256k1" }
) => {
  // https://www.rfc-editor.org/rfc/rfc7518#section-6.2.1.2
  const { crv } = opt;
  if (crv === "secp256k1" || crv === "P-256") {
    // https://github.com/indutny/elliptic#ecdsa
    const ec = new EC(curveNameMap[crv]);
    const _keyPair = ec.keyFromPrivate(privateKeyHex);
    // We must specify the length parameter (32) to avoid 00-truncated Buffer instances.
    // Example:
    //   Expected:
    //     <Buffer 00 11 a5 d4 fa fa bf b9 d5 c2 f6 9a d6 0d 78 9b 93 3b a0 68 2a b3 6d c5 a5 fe fc d3 1f 95 26 93>
    //   Wrong (When the length parameter is omitted):
    //     <Buffer 11 a5 d4 fa fa bf b9 d5 c2 f6 9a d6 0d 78 9b 93 3b a0 68 2a b3 6d c5 a5 fe fc d3 1f 95 26 93>
    const _key = _keyPair.getPublic();
    const x = base64url.encode(_key.getX().toArrayLike(Buffer, "be", 32));
    const y = base64url.encode(_key.getY().toArrayLike(Buffer, "be", 32));
    const d = base64url.encode(
      _keyPair.getPrivate().toArrayLike(Buffer, "be", 32)
    );
    return { ...opt, x, y, d };
  } else if (crv === "Ed25519") {
    // https://github.com/indutny/elliptic#eddsa
    const ec = new EdDSA("ed25519");
    const _key = ec.keyFromSecret(privateKeyHex);
    const x = base64url.encode(_key.getPublic());
    const d = base64url.encode(_key.getSecret());
    return { ...opt, x, d };
  } else {
    throw Error("specified illegal key pair");
  }
};
export default { privateKeyHexToJwk, sighJws, verifyJws, genKeyPair };
