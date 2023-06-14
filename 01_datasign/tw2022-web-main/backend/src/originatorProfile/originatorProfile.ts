import { HolderProfile } from "../store";
import { Validator } from "jsonschema";

const holderProfileSchema = {
  id: "/HolderProfile",
  type: "object",
  properties: {
    url: { type: "string" },
    name: { type: "string" },
    postalCode: { type: "string" },
    addressCountry: { type: "string" },
    addressRegion: { type: "string" },
    addressLocality: { type: "string" },
    streetAddress: { type: "string" },
    businessCategory: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: [
    "url",
    "name",
    "postalCode",
    "addressCountry",
    "addressRegion",
    "addressLocality",
    "streetAddress",
    "businessCategory",
  ],
};
const opRequestBodySchema = {
  id: "/OpRequestBody",
  type: "object",
  properties: {
    holderProfile: { $ref: "/HolderProfile" },
    expire: { type: "number" },
  },
  required: ["holderProfile", "expire"],
};
const certifierInfoSchema = {
  id: "/CertifierInfo",
  type: "object",
  properties: {
    url: { type: "string" },
    name: { type: "string" },
    postalCode: { type: "string" },
    addressCountry: { type: "string" },
    addressRegion: { type: "string" },
    addressLocality: { type: "string" },
    streetAddress: { type: "string" },
  },
  required: [
    "url",
    "name",
    "postalCode",
    "addressCountry",
    "addressRegion",
    "addressLocality",
    "streetAddress",
  ],
};
export const validateHolderProfile = (body: any) => {
  const v = new Validator();
  v.addSchema(holderProfileSchema, "/HolderProfile");
  v.addSchema(opRequestBodySchema, "/OpRequestBody");
  v.validate(body, opRequestBodySchema, { throwError: true });
};
const convertDate = (date: Date, expire: number): number => {
  const newDate = new Date(date);
  if (expire) {
    newDate.setDate(newDate.getDate() + expire);
  }
  return newDate.getTime();
};
export const buildOriginatorProfile = (profile: HolderProfile) => {
  const envCertifierInfo = process.env.CERTIFIER_INFO
    ? process.env.CERTIFIER_INFO
    : "";
  const certifierInfo = JSON.parse(envCertifierInfo);
  const v = new Validator();
  v.addSchema(certifierInfoSchema, "/CertifierInfo");
  v.validate(certifierInfo, certifierInfoSchema, {
    throwError: true,
  });
  const iat = convertDate(profile.created_at, 0);
  const exp = convertDate(profile.created_at, profile.expire);
  const holderProfile = JSON.parse(profile.profile);
  const credential = {
    type: "credential",
  };
  const certifier = {
    type: "certifier",
    url: certifierInfo.url,
    name: certifierInfo.name,
    postalCode: certifierInfo.postalCode,
    addressCountry: certifierInfo.addressCountry,
    addressRegion: certifierInfo.addressRegion,
    addressLocality: certifierInfo.addressLocality,
    streetAddress: certifierInfo.streetAddress,
  };
  const holder = { ...holderProfile, type: "holder" };
  const op = `${certifier.url}/jwt/claims/op`;
  return {
    [op]: {
      item: [credential, certifier, holder],
    },
    iss: certifier.url,
    sub: holder.url,
    iat: iat,
    exp: exp,
  };
};

export default { validateHolderProfile, buildOriginatorProfile };
