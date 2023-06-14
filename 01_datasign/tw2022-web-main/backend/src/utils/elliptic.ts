import base64url from "base64url";
import pkg, { eddsa } from "elliptic";
import crypto from "crypto";

const { ec: EC, eddsa: EdDSA } = pkg;

export type CRV = "secp256k1" | "P-256" | "Ed25519";
export interface PublicJwk {
  kty: "EC" | "OKP";
  // The crv type compatible with ion-tools
  // https://github.com/decentralized-identity/ion-tools#iongeneratekeypair-async
  crv: CRV;
  x: string;
  y?: string;
}
export interface PrivateJwk extends PublicJwk {
  d: string;
}
const curveNameMap: { [key in CRV]: string } = {
  secp256k1: "secp256k1",
  Ed25519: "ed25519",
  "P-256": "p256",
};

const privateKeyToECKeyPair = (privateKey: string, crv: CRV) => {
  const ec = new EC(curveNameMap[crv]);
  return ec.keyFromPrivate(base64url.toBuffer(privateKey));
};
const privateKeyToEdDSAKeyPair = (privateKey: string) => {
  const ec = new EdDSA("ed25519");
  return ec.keyFromSecret(privateKey);
};
export const generateECKeyPair = (crv: CRV = "secp256k1") => {
  const ec = new EC(curveNameMap[crv]);
  return ec.genKeyPair();
};
// not test yet
export const generateEdDSAKeyPair = () => {
  const buf = crypto.randomBytes(32);
  // const buf = new Uint8Array(crypto.randomBytes(32).buffer);
  // const num = new BN(buf).toNumber();
  // const hex = buf.toString("hex");
  const hex = buf.toString("hex");
  // const hex = "0x" + buf.toString("hex");
  console.log({ hex, len: buf.length });
  const ec = new EdDSA("ed25519");
  return ec.keyFromSecret(hex);
};
export interface ToJwkEcDsa {
  crv: "secp256k1" | "P-256";
  keyPair: pkg.ec.KeyPair;
}
export interface ToJwkEdDsa {
  crv: "Ed25519";
  keyPair: pkg.eddsa.KeyPair;
}
export type ToJwkArgs = ToJwkEcDsa | ToJwkEdDsa;

const toPublicJwk = (args: ToJwkArgs): PublicJwk => {
  const { crv, keyPair } = args;
  if (crv === "secp256k1" || crv === "P-256") {
    const _key = keyPair.getPublic();
    const kty = "EC";
    return {
      kty,
      crv,
      x: base64url.encode(_key.getX().toArrayLike(Buffer, "be", 32)),
      y: base64url.encode(_key.getY().toArrayLike(Buffer, "be", 32)),
    };
  } else if (crv === "Ed25519") {
    const kty = "OKP";
    return {
      kty,
      crv,
      x: base64url.encode(keyPair.getPublic()),
    };
  } else {
    throw new Error(`${crv} is not implemented`);
  }
};

const toPrivateJwk = (args: ToJwkArgs): PrivateJwk => {
  const { crv, keyPair } = args;
  if (crv === "secp256k1" || crv === "P-256") {
    const d = base64url.encode(
      keyPair.getPrivate().toArrayLike(Buffer, "be", 32)
    );
    const publicJwk = toPublicJwk(args);
    return {
      ...publicJwk,
      d,
    };
  } else if (crv === "Ed25519") {
    const d = base64url.encode(keyPair.getSecret());
    const publicJwk = toPublicJwk(args);
    return {
      ...publicJwk,
      d,
    };
  } else {
    throw new Error("unsupported crv", crv);
  }
};

export default {
  generateECKeyPair,
  privateKeyToECKeyPair,
  privateKeyToEdDSAKeyPair,
  toPrivateJwk,
  toPublicJwk,
};
