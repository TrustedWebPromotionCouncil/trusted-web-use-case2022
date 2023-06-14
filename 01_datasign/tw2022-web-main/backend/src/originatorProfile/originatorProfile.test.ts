import {
  buildOriginatorProfile,
  validateHolderProfile,
} from "./originatorProfile";
import { assert } from "chai";
import { env } from "node:process";

const body = {
  holderProfile: {
    url: "https://publisher.com",
    name: "Publisher Inc.",
    postalCode: "0000000",
    addressCountry: "JP",
    addressRegion: "Tokyo",
    addressLocality: "Shibuya",
    streetAddress: "0-0-0",
    businessCategory: ["media"],
  },
  expire: 30,
};
const wrongBody = {
  holderProfile: {
    name: "Publisher Inc.",
    postalCode: "0000000",
    addressCountry: "JP",
    addressRegion: "Tokyo",
    addressLocality: "Shibuya",
    streetAddress: "0-0-0",
    businessCategory: ["media"],
  },
  expire: 30,
};

const createdAt = "2023-01-25 00:00:00";
const profile = {
  rowid: 1,
  expire: 30,
  profile: JSON.stringify(body.holderProfile),
  created_at: new Date(createdAt),
};

const certifier = {
  url: "https://certifier.com",
  name: "Certifier Inc.",
  postalCode: "000-0000",
  addressCountry: "JP",
  addressRegion: "Tokyo",
  addressLocality: "Shibuya",
  streetAddress: "0-0-0",
};
env.CERTIFIER_INFO = JSON.stringify(certifier);

describe("originator profile test", () => {
  it("validate with correct", () => {
    try {
      validateHolderProfile(body);
    } catch (error) {
      assert.fail();
    }
  });
  it("validate with wrong", () => {
    try {
      validateHolderProfile(wrongBody);
    } catch (error: any) {
      assert.equal(error.message, 'requires property "url"');
    }
  });
  it("buildOriginatorProfile", () => {
    const result = buildOriginatorProfile(profile);
    const claim = `${certifier.url}/jwt/claims/op`;
    const op = {
      [claim]: {
        item: [
          {
            type: "credential",
          },
          {
            type: "certifier",
            url: certifier.url,
            name: certifier.name,
            postalCode: certifier.postalCode,
            addressCountry: certifier.addressCountry,
            addressRegion: certifier.addressRegion,
            addressLocality: certifier.addressLocality,
            streetAddress: certifier.streetAddress,
          },
          {
            type: "holder",
            url: "https://publisher.com",
            name: "Publisher Inc.",
            postalCode: "0000000",
            addressCountry: "JP",
            addressRegion: "Tokyo",
            addressLocality: "Shibuya",
            streetAddress: "0-0-0",
            businessCategory: ["media"],
          },
        ],
      },
      iss: "https://datasign.jp",
      sub: "https://publisher.com",
      iat: 1673974735000,
      exp: 1705510735000,
    };
    assert.notStrictEqual(result, op);
  });
});
