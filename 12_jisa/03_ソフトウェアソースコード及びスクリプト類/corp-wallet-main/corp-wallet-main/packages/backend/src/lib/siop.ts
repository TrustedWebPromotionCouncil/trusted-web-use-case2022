import ION from "@decentralized-identity/ion-tools";
import { calculateThumbprint, JWK } from "jose/jwk/thumbprint";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

import { getKeyPair, KeyPair } from "./key/key";

const DID_ION_KEY_ID = "signingKey";
const SIOP_VALIDITY_IN_MINUTES = 30;

const didObj = (keyPair: KeyPair) => {
  return new ION.DID({
    ops: [
      {
        operation: "create",
        content: {
          publicKeys: [
            {
              id: DID_ION_KEY_ID,
              type: "EcdsaSecp256k1VerificationKey2019",
              publicKeyJwk: keyPair.publicJwk,
              purposes: ["authentication"],
            },
          ],
        },
        recovery: keyPair,
        update: keyPair,
      },
    ],
  });
};

export const siop = async (options: any): Promise<string> => {
  const keyPair = await getKeyPair();
  return await ION.signJws({
    header: {
      typ: "JWT",
      alg: "ES256K",
      kid: `${await didObj(keyPair).getURI()}#${DID_ION_KEY_ID}`,
    },
    payload: {
      iat: moment().unix(),
      exp: moment().add(SIOP_VALIDITY_IN_MINUTES, "minutes").unix(),
      did: await didObj(keyPair).getURI(),
      jti: uuidv4().toUpperCase(),
      sub: await calculateThumbprint(keyPair.publicJwk),
      sub_jwk: {
        ...keyPair.publicJwk,
        key_ops: ["verify"],
        use: "sig",
        alg: "ES256K",
        kid: `${DID_ION_KEY_ID}`,
      },
      iss: "https://self-issued.me",
      ...options,
    },
    privateJwk: keyPair.privateJwk,
  });
};

export const siopV2 = async (options: any): Promise<string> => {
  const keyPair = await getKeyPair();
  return await ION.signJws({
    header: {
      typ: "JWT",
      alg: "ES256K",
      kid: `${await didObj(keyPair).getURI()}#${DID_ION_KEY_ID}`,
    },
    payload: {
      iat: moment().unix(),
      exp: moment().add(SIOP_VALIDITY_IN_MINUTES, "minutes").unix(),
      sub: await didObj(keyPair).getURI(),
      iss: "https://self-issued.me/v2/openid-vc",
      ...options,
    },
    privateJwk: keyPair.privateJwk,
  });
};

export const createVP = async (options: any): Promise<string> => {
  const keyPair = await getKeyPair();
  return await ION.signJws({
    header: {
      typ: "JWT",
      alg: "ES256K",
      kid: `${await didObj(keyPair).getURI()}#${DID_ION_KEY_ID}`,
    },
    payload: {
      iat: moment().unix(),
      exp: moment().add(SIOP_VALIDITY_IN_MINUTES, "minutes").unix(),
      nbf: moment().unix(),
      jti: uuidv4().toUpperCase(),
      vp: {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        type: ["VerifiablePresentation"],
        verifiableCredential: options.vcs,
      },
      iss: await didObj(keyPair).getURI(),
      aud: options.verifierDID,
      nonce: options.nonce,
    },
    privateJwk: keyPair.privateJwk,
  });
};
