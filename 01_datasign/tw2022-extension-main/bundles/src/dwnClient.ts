import key from "../../src/keys/elliptic";
import {
  CollectionsQuery,
  CollectionsWrite,
  CollectionsWriteMessage,
  CollectionsWriteOptions,
  Response,
} from "@tbd54566975/dwn-sdk-js";
import { v4 as uuidv4 } from "uuid";
import base64url from "base64url";

import { DIDState } from "../../src/did/types";
import { PrivateJwk } from "../../src/keys/types";

export interface QueryFilter {
  recipient?: string;
  protocol?: string;
  contextId?: string;
  schema?: string;
  recordId?: string;
  parentId?: string;
  dataFormat?: string;
}

interface Target {
  did: string;
  dwnLocation: string;
}
interface Recipient {
  did: string;
  keyId?: string;
  privateKeyJwk: PrivateJwk;
}

interface WriteTarget {
  didState: Pick<DIDState, "longForm">;
  privateKeyHex: string;
  dwnLocation: string;
  keyId?: string;
}
export const writeMessage = async (
  target: WriteTarget,
  recipient: string,
  data: string,
  schema?: string,
  published?: boolean
) => {
  const { didState, privateKeyHex, dwnLocation } = target;
  const keyId = target.keyId ?? "key-1";
  // https://www.rfc-editor.org/rfc/rfc7518.html#section-3.1
  const privateJwk = key.privateKeyHexToJwk(privateKeyHex);
  const opt: CollectionsWriteOptions = {
    target: didState.longForm,
    recipient,
    recordId: uuidv4(),
    data: new TextEncoder().encode(data),
    dataFormat: "application/json",
    schema,
    published,
    signatureInput: {
      protectedHeader: {
        alg: "ES256K",
        kid: `${didState.longForm}#${keyId}`,
      },
      jwkPrivate: privateJwk,
    },
  };
  const message = await CollectionsWrite.create(opt);
  const messages = [message.message];
  const res = await fetch(dwnLocation, {
    method: "post",
    body: JSON.stringify({ messages }),
  });
  return res;
};

export const queryMessage = async (
  target: Target,
  recipient: Recipient,
  queryFilter: QueryFilter = {}
) => {
  const { did: did1, dwnLocation } = target;
  const { did: did2, privateKeyJwk, keyId } = recipient;
  const signatureInput = {
    protectedHeader: {
      alg: "ES256K",
      kid: `${did2}#${keyId}`,
    },
    jwkPrivate: privateKeyJwk,
  };
  const queryMessage = await CollectionsQuery.create({
    target: did1,
    filter: queryFilter,
    signatureInput,
  });
  const messages = [queryMessage.message];
  try {
    const res = await fetch(dwnLocation, {
      method: "post",
      body: JSON.stringify({ messages }),
    });
    const body: Response = await res.json();
    if (body.replies) {
      const reply = body.replies[0];
      const { entries, ...rest } = reply;
      const decodedEntries = entries
        ?.filter((e): e is CollectionsWriteMessage => {
          return e.descriptor.method === "CollectionsWrite";
        })
        .map((e) => {
          const { encodedData } = e;
          const data = base64url.decode(encodedData || "");
          return { ...e, data };
        });
      return { ...rest, entries: decodedEntries };
    } else {
      console.warn(body);
      throw new Error("body replies not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  writeMessage,
  queryMessage,
};
