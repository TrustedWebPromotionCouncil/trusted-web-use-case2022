import base64url from "base64url";
import pkg from "elliptic";

const { ec: EC, curves } = pkg;

export type CRV = "p256" | "secp256k1" | "Ed25519";
export type KeyTypes = "EC" | "OKP";

export interface PublicJwk {
  crv: CRV;
  kty: KeyTypes;
  x: string;
  y?: string;
}

export interface PrivateJwk extends PublicJwk {
  d: string;
}

export const generateKeyPair = (crv: CRV = "p256") => {
  const ec = new EC(crv);
  const keyPair = ec.genKeyPair();
  return keyPair;
};

// 仕様では`secp256k1`(`ES256K`)も許容されてるがライブラリが`P-256`と`EdDSA`しか対応していないように見える
// JsonWebKey2020
// https://www.w3.org/community/reports/credentials/CG-FINAL-lds-jws2020-20220721/#jose-conformance
// ライブラリ
// https://github.com/decentralized-identity/did-jwt/blob/master/src/JWT.ts

const toPublicJwk = (
  keyPair: pkg.ec.KeyPair,
  kty = "EC",
  crv = "secp256k1"
) => {
  return {
    kty,
    crv,
    x: base64url.encode(
      keyPair.getPublic().getX().toArrayLike(Buffer, "be", 32)
    ),
    y: base64url.encode(
      keyPair.getPublic().getY().toArrayLike(Buffer, "be", 32)
    ),
  };
};

const toPrivateJwk = (
  keyPair: pkg.ec.KeyPair,
  kty = "EC",
  crv = "secp256k1"
) => {
  const d = base64url.encode(
    keyPair.getPrivate().toArrayLike(Buffer, "be", 32)
  );
  const publicJwk = toPublicJwk(keyPair, kty, crv);
  return {
    ...publicJwk,
    d,
  };
};

const privateKeyToKeyPair = (privateKey: string, crv: CRV) => {
  const ec = new EC(crv);
  return ec.keyFromPrivate(base64url.toBuffer(privateKey));
};

export default {
  generateKeyPair,
  privateKeyToKeyPair,
  toPublicJwk,
  toPrivateJwk,
};
