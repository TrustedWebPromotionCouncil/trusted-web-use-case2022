import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import { v4 as uuidv4 } from "uuid";

import { IssuablePerson, VerifiablePerson } from "../../src/utils/types";
import elliptic from "../../src/keys/elliptic";
import { SingleHDKeyRingController } from "../../src/keyRing/SingleHDKeyRingController";
import { AdUsage } from "../../src/store/types";
import {
  BusinessCategory,
  OriginatorProfileCertifier,
  OriginatorProfileHolder,
  OriginatorProfileItem,
  ProfilesSet,
} from "../src/types";
import base64url from "base64url";

export const authority = "https://opr.webdino.org";

const authorityKeyPair = elliptic.genKeyPair();
// const privKeyHex = authorityKeyPair.getPrivate("hex");
const privKeyHex =
  "7c43fb7cea9a6b2a0b6f97c6c6313c9e067e2933eb45a5101760544874b15790";
export const authorityPrivateJwk = elliptic.privateKeyHexToJwk(privKeyHex, {
  kty: "EC",
  crv: "P-256",
});
const { d, ...rest } = authorityPrivateJwk;
export const authorityPublicJwk = { ...rest };

const generateHolder = (overWrite: {
  businessCategory: BusinessCategory[];
}): OriginatorProfileHolder => {
  const url = faker.internet.url();
  const name = faker.company.name();
  return {
    ...overWrite,
    type: "holder",
    name,
    url,
  };
};
//https: github.com/Brightspace/node-jwk-to-pem
// @ts-ignore
const privKeyPem = jwkToPem(authorityPrivateJwk, { private: true });

export const generateOriginatorProfileHolder = (
  opts: Partial<OriginatorProfileHolder> = {}
): OriginatorProfileHolder => {
  const name = faker.company.name();
  const url = faker.internet.url();
  let item: OriginatorProfileHolder = { type: "holder", name, url, ...opts };
  return item;
};
export const generateOriginatorProfileCertifier = (
  opts: Partial<OriginatorProfileCertifier> = {}
): OriginatorProfileCertifier => {
  const name = faker.company.name();
  const url = faker.internet.url();
  let item: OriginatorProfileCertifier = {
    type: "certifier",
    name,
    url,
    ...opts,
  };
  return item;
};
export const generateProfile = (
  iss: string,
  item: OriginatorProfileItem[],
  opts?: { keyId?: string; sub?: string }
) => {
  const keyId = opts?.keyId ?? "key-1";
  const sub = opts?.sub ?? faker.internet.url();
  const namespace = `${iss}/jwt/claims`;
  const key = `${namespace}/op`;
  const profile = {
    iss,
    sub,
    [key]: {
      item,
    },
  };
  const token = jwt.sign(profile, privKeyPem, {
    algorithm: "ES256",
    keyid: keyId,
  });
  return { profile, token };
};
export const generateProfilesSet = (
  profile: string[],
  opts: {
    main?: string[];
    publisher?: string[];
    advertiser?: string[];
  } = {}
) => {
  const context = faker.internet.url();
  let profilesSet: ProfilesSet = {
    "@context": context,
    profile,
  };
  const { main, publisher, advertiser } = opts;
  if (main) {
    profilesSet = { ...profilesSet, main };
  }
  if (publisher) {
    profilesSet = { ...profilesSet, publisher };
  }
  if (advertiser) {
    profilesSet = { ...profilesSet, advertiser };
  }
  return profilesSet;
};

const testPassword = "test-password";
export const privateKeyHex = async () => {
  const keyRingController = new SingleHDKeyRingController();
  await keyRingController.createNewVault(testPassword);
  const address = await keyRingController.getAccounts();
  return await keyRingController.getPrivateKey(address[0]);
};

export const generateDid = (method: string = "ion") => {
  const did = `did:${method}:${uuidv4()}`;
  return {
    shortForm: did,
    longForm: `${did}:dummy-suffix`,
  };
};

export const generateMailAddress = () => {
  return faker.internet.email();
};

export const generateIssuablePerson = async (opt?: {
  dwnLocation?: string;
}): Promise<IssuablePerson> => {
  let person: IssuablePerson = {
    didState: generateDid(),
    privateKeyHex: await privateKeyHex(),
  };
  if (opt && opt.dwnLocation) {
    person = { ...person, dwnLocation: opt.dwnLocation };
  }
  return person;
};

export const generateVerifiablePerson = async (opt?: {
  issuablePerson?: IssuablePerson;
  dwnLocation?: string;
}): Promise<VerifiablePerson> => {
  if (opt && opt.issuablePerson) {
    const { didState, privateKeyHex, dwnLocation } = opt.issuablePerson;
    const publicKeyJwk = elliptic.privateKeyHexToJwk(privateKeyHex);
    let person: VerifiablePerson = {
      didState,
      publicKeyJwk,
    };
    if (opt && opt.dwnLocation) {
      person = { ...person, dwnLocation: opt.dwnLocation };
    } else if (dwnLocation) {
      person = { ...person, dwnLocation: dwnLocation };
    }
    return person;
  } else {
    const _privateKeyHex = await privateKeyHex();
    const publicKeyJwk = elliptic.privateKeyHexToJwk(_privateKeyHex);
    let person: VerifiablePerson = {
      didState: generateDid(),
      publicKeyJwk,
    };
    if (opt && opt.dwnLocation) {
      person = { ...person, dwnLocation: opt.dwnLocation };
    }
    return person;
  }
};

const generateVerificationMethod = (
  didSubject: VerifiablePerson,
  verificationMethodId: string = "#key-1"
) => {
  const { didState, publicKeyJwk } = didSubject;
  return {
    id: verificationMethodId,
    type: "JsonWebKey2020",
    controller: didState.longForm,
    publicKeyJwk,
  };
};
export const generateDidDocument = (didSubject: VerifiablePerson) => {
  const { didState, publicKeyJwk } = didSubject;
  return {
    didDocument: {
      id: didState.longForm,
      verificationMethod: [generateVerificationMethod(didSubject)],
      authentication: ["#key-1"],
    },
    didDocumentMetadata: {},
    didResolutionMetadata: {},
  };
};

export const generateHistory = (overWrite: {} = {}) => {
  const didState = generateDid();
  const url = faker.internet.url();
  const dwnLocation = faker.internet.url();
  const domain = new URL(url).host;
  const createdAt = faker.date.past().toISOString();
  return {
    did: generateDid().longForm,
    provided: true,
    url,
    domain,
    notBot: {
      name: "re-captcha-test",
      agent: { name: didState.longForm },
      result: true,
    },
    adId: { id: uuidv4(), usage: ["advertiser"] as AdUsage[] },
    pairwiseAccount: {
      didState,
      address: "0x059424d3b91a151bb8a63ae3691d2db7e5206dc6",
      dwnLocation,
    },
    createdAt,
    ...overWrite,
  };
};

export const generateWriteMessageEntry = (
  target: string,
  recipient: string,
  data: string,
  overWrite: {} = {}
) => {
  const encodedData = base64url.encode(data);
  const createdAt = faker.date.past().toISOString();
  return {
    descriptor: {
      target,
      recipient,
      recordId: uuidv4(),
      dataCid: "dummy-cid",
      dataFormat: "application/json",
      dateCreated: createdAt,
      method: "CollectionsWrite",
      ...overWrite,
    },
    encodedData,
  };
};
