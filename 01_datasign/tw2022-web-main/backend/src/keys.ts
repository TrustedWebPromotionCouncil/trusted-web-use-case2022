import base64url from "base64url";
import { Validator } from "jsonschema";
import jwkToPem from "jwk-to-pem";

import ec, { CRV, PublicJwk, ToJwkArgs } from "./utils/elliptic";

export type { CRV };

interface Jwk {
  kty: string;
  // https://www.rfc-editor.org/rfc/rfc7518.html#section-3.1
  alg?: string;
  kid?: string;
}

const generateKeyPair = (crv: CRV = "secp256k1") => {
  if (crv === "secp256k1" || crv === "P-256") {
    return ec.generateECKeyPair(crv);
  } else {
    // todo
    throw new Error(`${crv} is not implemented yet`);
  }
};
const privateKeyHexToJwk = (privateKeyHex: string, crv: CRV) => {
  if (crv === "secp256k1" || crv === "P-256") {
    const keyPair = ec.privateKeyToECKeyPair(privateKeyHex, crv);
    // const _key = keyPair.getPublic();
    return ec.toPrivateJwk({ crv, keyPair });
  } else {
    // todo
    throw new Error(`${crv} is not implemented yet`);
  }
};
const keyPairToJwk = (args: ToJwkArgs) => {
  return ec.toPrivateJwk(args);
};

const b64ToBuf = (privateKey: string) => {
  const buf = base64url.toBuffer(privateKey);
  const hex = "0x" + buf.toString("hex");
  console.log({ hex });
};

const getPrivateKeyPem = (privateKey: string, crv: CRV) => {
  const authorityPrivateJwk = privateKeyHexToJwk(privateKey, crv);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return jwkToPem(authorityPrivateJwk, { private: true });
};

export interface AppSignKey {
  id: string;
  key: string;
}

const appSignKeySchema = {
  id: "/AppSignKey",
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      key: { type: "string" },
    },
    required: ["id", "key"],
  },
  required: ["items"],
};
const getEnvKeys = (): AppSignKey[] => {
  const envAppSignKey = process.env.OP_SIGN_KEY || "";
  const appSignKey = JSON.parse(envAppSignKey);
  const v = new Validator();
  v.addSchema(appSignKeySchema, "/AppSignKey");
  v.validate(appSignKey, appSignKeySchema, {
    throwError: true,
  });
  return appSignKey;
};
const getPrivateById = (keyId: string, keyList: AppSignKey[]) => {
  return keyList.find((key) => key.id === keyId);
};

const getPublicJwks = (keys: AppSignKey[]): object => {
  const k = keys.map((key) => {
    const jwk = privateKeyHexToJwk(key.key, "P-256");
    const { d, ...rest } = jwk;
    return { ...rest, kid: key.id };
  });
  return { keys: k };
};

export default {
  keyPairToJwk,
  generateKeyPair,
  getEnvKeys,
  getPrivateById,
  getPublicJwks,
  getPrivateKeyPem,
  privateKeyHexToJwk,
};
