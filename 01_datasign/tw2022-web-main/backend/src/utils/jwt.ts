import pkg from "elliptic";
import {
  EdDSASigner,
  ES256Signer,
  ES256KSigner,
  Signer,
  createJWT,
  verifyJWT,
  base64ToBytes,
} from "did-jwt";

import { CRV } from "../keys";
import { ionResolver } from "../resolver";
import jwt from "jsonwebtoken";

export type ALG = "ES256" | "ES256K" | "EdDSA";
interface SupportedSuite {
  [key: string]: { crv: CRV; signer: (privateKey: Uint8Array) => Signer };
}

// https://www.w3.org/community/reports/credentials/CG-FINAL-lds-jws2020-20220721/#jose-conformance
const SUPPORTED_SUITE: SupportedSuite = {
  ES256: { crv: "P-256", signer: ES256Signer },
  ES256K: { crv: "secp256k1", signer: ES256KSigner },
  EdDSA: { crv: "Ed25519", signer: EdDSASigner },
};

export const generateJwt = async (
  issuer: string,
  keyPair: pkg.ec.KeyPair,
  payload: Record<string, unknown>,
  header = { alg: "ES256K" }
) => {
  const signer = SUPPORTED_SUITE[header.alg].signer(
    keyPair.getPrivate().toArrayLike(Buffer, "be", 32)
  );
  const _payload = { ...payload, iss: issuer };
  return await createJWT(_payload, { issuer, signer }, header);
};

export const decodeJwt = async (jwt: string) => {
  return await verifyJWT(jwt, {
    resolver: ionResolver,
    proofPurpose: "authentication",
  });
};

const getSigner = (b64PrivateKey: string, alg: ALG) => {
  if (alg === "ES256K" || alg === "ES256") {
    // const keyPair = keys.privateKeyToKeyPair(
    //   b64PrivateKey,
    //   SUPPORTED_SUITE[alg].crv
    // );
    // return SUPPORTED_SUITE[alg].signer(
    //   keyPair.getPrivate().toArrayLike(Buffer, "be", 32)
    // );
    return SUPPORTED_SUITE[alg].signer(base64ToBytes(b64PrivateKey));
  } else {
    // const buf = base64ToBytes(b64PrivateKey);
    // // const buf = base64url.toBuffer(b64PrivateKey);
    // return SUPPORTED_SUITE[alg].signer(buf);
    throw new Error(`${alg} is not implemented yet`);
  }
};

export const tokenProfile = (op: object, keyId: string, privateKey: string) =>
  jwt.sign(op, privateKey, {
    algorithm: "ES256",
    keyid: keyId,
  });

export default {
  generateJwt,
  decodeJwt,
  getSigner,
  tokenProfile,
};
