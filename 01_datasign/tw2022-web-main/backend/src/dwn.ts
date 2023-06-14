import {
  CollectionsWrite,
  CollectionsWriteOptions,
} from "@tbd54566975/dwn-sdk-js";
import { v4 as uuidv4 } from "uuid";

export type Jwk = {
  alg?: string;
  kid?: string;
  kty: string;
};
export type PublicJwk = Jwk & {
  crv: string;
  x: string;
  y?: string;
};
export type PrivateJwk = PublicJwk & {
  d: string;
};

export const createWriteMessage = async (
  target: string,
  recipient: string,
  data: string,
  privateJwk: PrivateJwk
) => {
  const opt: CollectionsWriteOptions = {
    target,
    recipient,
    recordId: uuidv4(),
    data: new TextEncoder().encode(data),
    dataFormat: "application/json",
    signatureInput: {
      protectedHeader: {
        alg: privateJwk.alg as string,
        kid: `${target}/#key-1`,
      },
      jwkPrivate: privateJwk,
    },
  };
  const message = await CollectionsWrite.create(opt);
  return message;
};
