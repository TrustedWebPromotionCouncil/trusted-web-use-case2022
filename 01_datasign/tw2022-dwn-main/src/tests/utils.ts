import {
  CollectionsWrite,
  CollectionsWriteOptions,
  CollectionsQuery,
  PublicJwk,
  PrivateJwk,
} from "@tbd54566975/dwn-sdk-js";
import pkg from "elliptic";
import { v4 as uuidv4 } from "uuid";

import keys from "../services/keys";

const { ec: EC } = pkg;

interface KeyId {
  did: string;
  fragment: string;
}
export interface Person {
  did: string;
  keyId: KeyId;
  publicJwk: PublicJwk;
  privateJwk: PrivateJwk;
}
const generateUser = (did: string, keyId?: KeyId, keyPair?: pkg.ec.KeyPair) => {
  const ec = new EC("secp256k1");
  const key = keyPair ?? ec.genKeyPair();
  const privateJwk: PrivateJwk = keys.toPrivateJwk(key);
  const publicJwk: PublicJwk = keys.toPublicJwk(key);
  return {
    did,
    keyId: {
      did,
      fragment: keyId?.fragment ?? "#key-1",
    },
    publicJwk,
    privateJwk,
  };
};

const generateSignatureInput = (person: Person) => {
  return {
    protectedHeader: {
      alg: person.privateJwk.alg as string,
      kid: person.did + person.keyId.fragment,
    },
    jwkPrivate: person.privateJwk,
  };
};

const generateFakeVerificationMethod = (didSubject: Person) => {
  return {
    id: didSubject.keyId.fragment,
    type: "JsonWebKey2020",
    controller: didSubject.did,
    publicKeyJwk: didSubject.publicJwk,
  };
};

const generatePublishedRecordWriteMessage = async (
  target: Person,
  dataPayload: {},
  option: Partial<CollectionsWriteOptions> = {}
) => {
  const data = JSON.stringify(dataPayload);
  const opt = {
    target: target.did,
    recipient: target.did,
    recordId: option.recordId ?? uuidv4(),
    data: new TextEncoder().encode(data),
    dataFormat: "application/json",
    published: true,
    signatureInput: generateSignatureInput(target),
    ...option,
  };
  const writeMessage = await CollectionsWrite.create(opt);
  return writeMessage.message;
};

const generateUnPublishedRecordWriteMessage = async (
  target: Person,
  recipient: Person,
  dataPayload: {},
  option: Partial<CollectionsWriteOptions> = {}
) => {
  const data = JSON.stringify(dataPayload);
  // const recordId = uuidv4();
  const opt = {
    target: target.did,
    recipient: recipient.did,
    recordId: option.recordId ?? uuidv4(),
    data: new TextEncoder().encode(data),
    dataFormat: "application/json",
    published: false,
    signatureInput: generateSignatureInput(target),
    ...option,
  };
  const writeMessage = await CollectionsWrite.create(opt);
  return writeMessage.message;
};

export interface QueryFilter {
  recipient?: string;
  protocol?: string;
  contextId?: string;
  schema?: string;
  recordId?: string;
  parentId?: string;
  dataFormat?: string;
}
const generateCollectionsQueryMessage = async (
  requester: Person,
  target: Person,
  queryFilter: QueryFilter = {}
) => {
  const queryMessage = await CollectionsQuery.create({
    target: target.did,
    filter: queryFilter,
    signatureInput: generateSignatureInput(requester),
  });
  return queryMessage.message;
};

export default {
  generateUser,
  generateSignatureInput,
  generateFakeVerificationMethod,
  generatePublishedRecordWriteMessage,
  generateUnPublishedRecordWriteMessage,
  generateCollectionsQueryMessage,
};
