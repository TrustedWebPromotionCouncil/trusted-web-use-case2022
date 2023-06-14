/**
 * @jest-environment ./jest-custom-environment
 */
import base64url from "base64url";
import { v4 as uuidv4 } from "uuid";
import fetchMock from "fetch-mock";
import didJWT from "did-jwt";
import { CollectionsWriteMessage } from "@tbd54566975/dwn-sdk-js";

import {
  setVerifiedContext,
  getVerifiedContext,
  getProvidedHistories,
  saveProvidedHistories,
  initialProvidedHistories,
} from "../../src/utils/dataStore";
import { SingleHDKeyRingController } from "../../src/keyRing/SingleHDKeyRingController";

import {
  generateDid,
  generateMailAddress,
  generateIssuablePerson,
  generateHistory,
  authority,
  generateOriginatorProfileCertifier,
  generateOriginatorProfileHolder,
  generateProfile,
  generateWriteMessageEntry,
} from "../test/fixtures";
import { FirstParty, Providable, VerifiedFirstParty } from "../src/types";
import { DIDState, IssuablePerson } from "../../src/utils/types";
import { AccountState, AdIdSetting } from "../../src/store/types";
import {
  makeAutomaticallyConsentedParties,
  _providePersonalData,
  _provideMailAddress,
  _getAccessLog,
  collectPairwiseAccount,
  syncToDwn,
} from "./asyncHandler";

jest.mock("@decentralized-identity/ion-tools", () => {
  // https://jestjs.io/ja/docs/mock-functions#mocking-partials
  const originalModule = jest.requireActual(
    "@decentralized-identity/ion-tools"
  );
  const originalConstructor =
    originalModule.AnchorRequest.prototype.constructor;
  class AnchorRequest {
    submit() {}
  }
  AnchorRequest.prototype.constructor = originalConstructor;
  const paritallyMocked = {
    ...originalModule,
    AnchorRequest,
  };
  return {
    __esModule: true,
    default: paritallyMocked,
  };
});

describe("Verification Context", () => {
  const url = "http://localhost:9000";
  const host = new URL(url).host;
  const expected = {
    url,
    succeeded: true,
    did: "did:ion:123",
    profiles: [],
    thirdParties: [
      {
        url: "https://www.google-analytics.com/analytics.js",
        succeeded: true,
        type: "advertising",
        did: "did:ion:456",
        profiles: [],
      },
    ],
  };
  test("get test", async () => {
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({});
    const result = await getVerifiedContext(host);
    expect(result).toBeFalsy();
    expect(chrome.storage.local.get).toHaveBeenCalledWith("verifiedContext");
  });
  test("get test2", async () => {
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({
      verifiedContext: { [host]: expected },
    });
    const result = await getVerifiedContext(host);
    expect(result).toBe(expected);
    expect(chrome.storage.local.get).toHaveBeenCalledWith("verifiedContext");
  });
  test("set test", async () => {
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({});
    await setVerifiedContext(expected);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      verifiedContext: { [host]: expected },
    });
  });
});
describe("Provided History", () => {
  const globalAdId = uuidv4();
  test("get test", async () => {
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({});
    const result = await getProvidedHistories();
    expect(result).toStrictEqual(initialProvidedHistories);
    expect(chrome.storage.local.get).toHaveBeenCalledWith("providedHistories");
  });
  test("get test2", async () => {
    const subHistory = generateHistory();
    const history = { ...generateHistory(), thirdParties: [subHistory] };
    const savedValue = { histories: [history], globalAdId };
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({
      providedHistories: savedValue,
    });
    const result = await getProvidedHistories();
    expect(result).toBe(savedValue);
    expect(chrome.storage.local.get).toHaveBeenCalledWith("providedHistories");
  });
  test("set test", async () => {
    const subHistory = generateHistory();
    const history = { ...generateHistory(), thirdParties: [subHistory] };
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({});
    await saveProvidedHistories(history, globalAdId);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      providedHistories: { histories: [history], globalAdId },
    });
  });
  test("set test2", async () => {
    const subHistory = generateHistory();
    const history = { ...generateHistory(), thirdParties: [subHistory] };
    const savedValue = { histories: [history], globalAdId };
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({
      providedHistories: savedValue,
    });
    const subHistory2 = generateHistory();
    const history2 = { ...generateHistory(), thirdParties: [subHistory2] };
    await saveProvidedHistories(history2, globalAdId);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      providedHistories: { histories: [history, history2], globalAdId },
    });
  });
  test("set test3", async () => {
    const subHistory = generateHistory();
    const history = { ...generateHistory(), thirdParties: [subHistory] };
    const savedValue = { histories: [history], globalAdId };
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({
      providedHistories: savedValue,
    });
    const subHistory2 = generateHistory();
    const history2 = { ...generateHistory(), thirdParties: [subHistory2] };
    await saveProvidedHistories(history2);
    expect(chrome.storage.local.set).toHaveBeenCalledWith({
      providedHistories: { histories: [history, history2], globalAdId },
    });
  });
});

describe("make automatically consented data", () => {
  const iss = authority;
  const certifier = generateOriginatorProfileCertifier();
  const publisher = generateOriginatorProfileHolder({
    businessCategory: ["media"],
  });
  const advertiser = generateOriginatorProfileHolder({
    businessCategory: ["advertiser"],
  });
  const profile1 = generateProfile(iss, [certifier, publisher]);
  const profile2 = generateProfile(iss, [certifier, advertiser]);

  const did1 = generateDid();
  const did2 = generateDid();

  test("verified all ok", async () => {
    const arg: VerifiedFirstParty = {
      id: uuidv4(),
      date: new Date().toISOString(),
      url: profile1.profile.sub,
      did: did1.longForm,
      verified: "ok",
      originatorProfile: profile1.profile,
      thirdParties: [
        {
          id: uuidv4(),
          date: new Date().toISOString(),
          did: did2.longForm,
          verified: "ok",
          originatorProfile: profile2.profile,
        },
      ],
    };
    const ret = makeAutomaticallyConsentedParties(arg);
    expect(ret!.consentToProvide).toBe(true);
    expect(ret!.thirdParties![0].consentToProvide).toBe(true);
  });
  test("exists ng 3rd-party", async () => {
    const arg: VerifiedFirstParty = {
      id: uuidv4(),
      date: new Date().toISOString(),
      url: profile1.profile.sub,
      did: did1.longForm,
      verified: "ok",
      originatorProfile: profile1.profile,
      thirdParties: [
        {
          id: uuidv4(),
          date: new Date().toISOString(),
          did: did2.longForm,
          verified: "ng",
          originatorProfile: profile2.profile,
        },
      ],
    };
    const ret = makeAutomaticallyConsentedParties(arg);
    expect(ret!.consentToProvide).toBe(true);
    expect(ret!.thirdParties![0].consentToProvide).toBe(true);
  });
  test("no did 3rd-party", async () => {
    const arg: VerifiedFirstParty = {
      id: uuidv4(),
      date: new Date().toISOString(),
      url: profile1.profile.sub,
      did: did1.longForm,
      verified: "ok",
      originatorProfile: profile1.profile,
      thirdParties: [
        {
          id: uuidv4(),
          date: new Date().toISOString(),
          verified: "ng",
          originatorProfile: profile2.profile,
        },
      ],
    };
    const ret = makeAutomaticallyConsentedParties(arg);
    expect(ret!.consentToProvide).toBe(true);
    expect(ret!.thirdParties![0].consentToProvide).toBe(false);
  });
  test("no did 1st-party", async () => {
    const arg: VerifiedFirstParty = {
      id: uuidv4(),
      date: new Date().toISOString(),
      url: profile1.profile.sub,
      verified: "ok",
      originatorProfile: profile1.profile,
    };
    const errorFunc = () => {
      makeAutomaticallyConsentedParties(arg);
    };
    await expect(errorFunc).toThrow("did not found at 1st-party");
  });
});

describe("Provide Personal Data", () => {
  const authorityUrl = process.env.NOT_BOT_AUTHORITY_URL!;
  const dwnLocation = "https://dwn.exampl.com";
  const adIdSetting: AdIdSetting = { scope: "global", usage: ["advertiser"] };
  let person: IssuablePerson;
  let pairwiseAccount: IssuablePerson;
  const did1 = generateDid();
  const did2 = generateDid();
  const iss = authority;
  const certifier = generateOriginatorProfileCertifier();
  const publisher = generateOriginatorProfileHolder({
    businessCategory: ["media"],
  });
  const advertiser = generateOriginatorProfileHolder({
    businessCategory: ["advertiser"],
  });
  const profile1 = generateProfile(iss, [certifier, publisher]);
  const profile2 = generateProfile(iss, [certifier, advertiser]);

  const party: FirstParty<Providable> & Providable = {
    id: uuidv4(),
    date: new Date().toISOString(),
    url: profile1.profile.sub,
    did: did1.longForm,
    consentToProvide: true,
    verified: "ok",
    originatorProfile: profile1.profile,
    thirdParties: [
      {
        id: uuidv4(),
        date: new Date().toISOString(),
        did: did2.longForm,
        verified: "ok",
        consentToProvide: true,
        originatorProfile: profile2.profile,
      },
    ],
  };

  beforeAll(async () => {
    person = await generateIssuablePerson();
    pairwiseAccount = await generateIssuablePerson();

    const authority = await generateIssuablePerson();
    const { didState, privateKeyHex } = authority;
    const signer = didJWT.ES256KSigner(didJWT.hexToBytes(privateKeyHex));
    const payload = {
      sub: person.didState.longForm,
      iss: didState.longForm,
      vc: { credentialSubject: {} },
    };
    const jwt = await didJWT.createJWT(
      payload,
      { issuer: didState.longForm, signer },
      { alg: "ES256K" }
    );
    const body1 = { notBotVC: jwt };
    const body2 = { status: { code: 200, message: "OK" } };
    fetchMock.post(authorityUrl, { status: 201, body: body1 });
    fetchMock.post(dwnLocation, { status: 200, body: body2 });
  });
  afterAll(() => {
    fetchMock.restore();
  });

  test("first providing", async () => {
    const providedHistories = { histories: [], globalAdId: "" };
    const setting = { reCaptchaApiHost: "https://api.re-capthca.example.com" };
    chrome.storage.local.get
      // @ts-ignore
      .mockResolvedValueOnce({ providedHistories }) // called from getProvidedHistories
      .mockResolvedValueOnce({ setting }) // called from getProvidedHistories
      .mockResolvedValueOnce({ providedHistories }); // called from saveProvidedHistories
    const mainAccount = {
      didState: person.didState,
      privateKeyHex: person.privateKeyHex,
      adIdSetting,
    };
    const pa = {
      ...pairwiseAccount,
      address: "0x059424d3b91a151bb8a63ae3691d2db7e5206dc6",
      dwnLocation,
    };
    const history = await _providePersonalData(mainAccount, pa, party);
    if (history) {
      expect(history.did).toBe(did1.longForm);
      expect(history.url).toBe(profile1.profile.sub);
      const { thirdParties } = history;
      expect(thirdParties.length).toBe(1);
      expect(thirdParties[0].did).toBe(did2.longForm);
      expect(thirdParties[0].url).toBe(profile2.profile.sub);
      // @ts-ignore
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        providedHistories: {
          histories: [history],
          globalAdId: history.adId!.id,
        },
      });
    } else {
      throw new Error("test was failed.");
    }
  });
  test("mail address providing", async () => {
    const providedHistories = { histories: [], globalAdId: "" };
    chrome.storage.local.get
      // @ts-ignore
      .mockResolvedValueOnce({ providedHistories }) // called from getProvidedHistories
      .mockResolvedValueOnce({ providedHistories }); // called from saveProvidedHistories
    const pa = {
      ...pairwiseAccount,
      address: "0x059424d3b91a151bb8a63ae3691d2db7e5206dc6",
      dwnLocation,
    };
    const mailAddress = generateMailAddress();
    const history = await _provideMailAddress(pa, mailAddress, party);
    if (history) {
      expect(history.did).toBe(did1.longForm);
      expect(history.url).toBe(profile1.profile.sub);
      expect(history.mailAddress).toBe(mailAddress);
      const { thirdParties } = history;
      expect(thirdParties.length).toBe(1);
      expect(thirdParties[0].did).toBe(did2.longForm);
      expect(thirdParties[0].url).toBe(profile2.profile.sub);
      // @ts-ignore
      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        providedHistories: {
          histories: [history],
          globalAdId: "",
        },
      });
    } else {
      throw new Error("test was failed.");
    }
    fetchMock.restore();
  });
});

const toLogData = (
  accessor: Pick<DIDState, "shortForm">,
  recordId: string,
  schema: string
) => {
  return JSON.stringify({ accessor: accessor.shortForm, recordId, schema });
};
const toResponse = (entries: any[]) => {
  return {
    status: 200,
    replies: [
      {
        status: 200,
        entries,
      },
    ],
  };
};

describe("Issued Pairwise Account", () => {
  test("was not issued", async () => {
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({});
    const issuedPairwiseAccount = await collectPairwiseAccount();
    expect(issuedPairwiseAccount.length).toBe(0);
  });
  test("was issued once", async () => {
    const keyRingController = new SingleHDKeyRingController();
    await keyRingController.createNewVault("test");
    const addr1 = await keyRingController.addAccount();

    const pairwiseAccount = {
      didState: generateDid(),
      address: addr1,
      dwnLocation: "dummy",
    };
    const subHistory = generateHistory();
    const history = {
      ...generateHistory({ pairwiseAccount }),
      thirdParties: [subHistory],
    };
    const savedValue = { histories: [history], globalAdId: "" };
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({
      providedHistories: savedValue,
    });
    const issuedPairwiseAccount = await collectPairwiseAccount();
    expect(issuedPairwiseAccount.length).toBe(1);
    expect(issuedPairwiseAccount[0].address).toBe(addr1);
  });
  test("was issued twice", async () => {
    const keyRingController = new SingleHDKeyRingController();
    await keyRingController.createNewVault("test");
    const addr1 = await keyRingController.addAccount();
    const addr2 = await keyRingController.addAccount();

    const subHistory = generateHistory();
    const history1 = {
      ...generateHistory({
        pairwiseAccount: {
          didState: generateDid(),
          address: addr1,
          dwnLocation: "dummy",
        },
      }),
      thirdParties: [subHistory],
    };
    const history2 = {
      ...generateHistory({
        pairwiseAccount: {
          didState: generateDid(),
          address: addr2,
          dwnLocation: "dummy",
        },
      }),
      thirdParties: [subHistory],
    };
    const savedValue = { histories: [history1, history2], globalAdId: "" };
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({
      providedHistories: savedValue,
    });
    const issuedPairwiseAccount = await collectPairwiseAccount();
    expect(issuedPairwiseAccount.length).toBe(2);
    expect(issuedPairwiseAccount[0].address).toBe(addr1);
    expect(issuedPairwiseAccount[1].address).toBe(addr2);
  });
  test("was issued twice under the same account", async () => {
    const keyRingController = new SingleHDKeyRingController();
    await keyRingController.createNewVault("test");
    const addr1 = await keyRingController.addAccount();

    const subHistory = generateHistory();
    const didState = generateDid();
    const history1 = {
      ...generateHistory({
        pairwiseAccount: {
          didState,
          address: addr1,
          dwnLocation: "dummy",
        },
      }),
      thirdParties: [subHistory],
    };
    const history2 = {
      ...generateHistory({
        pairwiseAccount: {
          didState,
          address: addr1,
          dwnLocation: "dummy",
        },
      }),
      thirdParties: [subHistory],
    };
    const savedValue = { histories: [history1, history2], globalAdId: "" };
    // @ts-ignore
    chrome.storage.local.get.mockResolvedValueOnce({
      providedHistories: savedValue,
    });
    const issuedPairwiseAccount = await collectPairwiseAccount();
    expect(issuedPairwiseAccount.length).toBe(1);
    expect(issuedPairwiseAccount[0].address).toBe(addr1);
  });
});

describe("Access Log", () => {
  const dwnLocation = "https://dwn.exampl.com";
  const did0 = generateDid(); // d-web-node app
  const did1 = generateDid(); // recipient (personal data owner)
  const did2 = generateDid(); // recipient (personal data owner)
  const did3 = generateDid(); // accessor (providing dest company)
  const did4 = generateDid(); // accessor (providing dest company)

  /*
    |       | company1              | company2              |
    | ----- | --------------------- | --------------------- |
    | pair1 | data1-1 <- access log | data1-2 <- access log |
    | pair2 | data2-1 <- access log | data2-2 <- access log |
   */
  test("get", async () => {
    const data1_1 = toLogData(did3, "record1", "TestSchema1");
    const data1_2 = toLogData(did4, "record2", "TestSchema1");
    const response1 = toResponse([
      generateWriteMessageEntry(did0.shortForm, did1.longForm, data1_1, {
        dateCreated: "1",
      }),
      generateWriteMessageEntry(did0.shortForm, did1.longForm, data1_2, {
        dateCreated: "2",
      }),
    ]);
    const data2_1 = toLogData(did3, "record3", "TestSchema1");
    const data2_2 = toLogData(did4, "record4", "TestSchema1");
    const response2 = toResponse([
      generateWriteMessageEntry(did0.shortForm, did2.longForm, data2_1, {
        dateCreated: "3",
      }),
      generateWriteMessageEntry(did0.shortForm, did2.longForm, data2_2, {
        dateCreated: "4",
      }),
    ]);
    fetchMock.once(
      { url: dwnLocation, name: "request1", method: "POST" },
      response1
    );
    fetchMock.once(
      { url: dwnLocation, name: "request2", method: "POST" },
      response2
    );

    const keyRingController = new SingleHDKeyRingController();
    await keyRingController.createNewVault("test");
    const addr1 = await keyRingController.addAccount();
    const addr2 = await keyRingController.addAccount();

    const pairwiseAccount1 = {
      didState: did1,
      address: addr1,
      dwnLocation,
    };
    const pairwiseAccount2 = {
      didState: did2,
      address: addr2,
      dwnLocation,
    };
    const histories = [
      { pairwiseAccount: pairwiseAccount1 },
      { pairwiseAccount: pairwiseAccount2 },
    ];
    const providedHistories = { histories, globalAdId: "" };
    const setting = {
      accessLogTargetDid:
        "did:ion:EiAitvVc6ZZUQEA2B7gZHi0cSXXpjGiHuv00tCmrGH9dGQ",
    };
    chrome.storage.local.get
      // @ts-ignore
      .mockResolvedValueOnce({ providedHistories }) // called from getProvidedHistories
      .mockResolvedValueOnce({ setting }); // called from getSetting
    const reply = await _getAccessLog(keyRingController);
    expect(reply.length).toBe(4);

    expect(reply[0].owner).toBe(did2.shortForm);
    expect(reply[0].accessor).toBe(did4.shortForm);
    expect(reply[0].recordId).toBe("record4");

    expect(reply[1].owner).toBe(did2.shortForm);
    expect(reply[1].accessor).toBe(did3.shortForm);
    expect(reply[1].recordId).toBe("record3");

    expect(reply[2].owner).toBe(did1.shortForm);
    expect(reply[2].accessor).toBe(did4.shortForm);
    expect(reply[2].recordId).toBe("record2");

    expect(reply[3].owner).toBe(did1.shortForm);
    expect(reply[3].accessor).toBe(did3.shortForm);
    expect(reply[3].recordId).toBe("record1");

    const calls = fetchMock.calls(dwnLocation);
    expect(calls.length).toBe(2);
    expect(calls[0].identifier).toBe("request1");
    expect(calls[1].identifier).toBe("request2");
    fetchMock.restore();
  });
});

describe("Sync to Dwn", () => {
  const dwnLocation = "https://dwn.exampl.com";
  let initState = { vault: "" };
  let person: IssuablePerson;
  let pairwiseAccount: IssuablePerson;
  const did1 = generateDid();
  const did2 = generateDid();
  const iss = authority;
  const certifier = generateOriginatorProfileCertifier();
  const publisher = generateOriginatorProfileHolder({
    businessCategory: ["media"],
  });
  const advertiser = generateOriginatorProfileHolder({
    businessCategory: ["advertiser"],
  });
  const profile1 = generateProfile(iss, [certifier, publisher]);
  const profile2 = generateProfile(iss, [certifier, advertiser]);

  let accountState: Omit<AccountState, "didState"> & {
    didState: Omit<DIDState, "ops">;
  };

  beforeAll(async () => {
    person = await generateIssuablePerson();
    pairwiseAccount = await generateIssuablePerson();

    const keyRingController = new SingleHDKeyRingController();
    await keyRingController.createNewVault("test");
    initState.vault = keyRingController.encryptedVault;

    const { didState } = person;
    accountState = {
      didState,
      encryptedVault: initState.vault,
      dwnSetting: { location: dwnLocation, defaultLocation: false },
    };

    const body = { status: { code: 200, message: "OK" } };
    fetchMock.post(dwnLocation, { status: 200, body });
  });
  afterAll(() => {
    fetchMock.restore();
  });

  test("sync account state", async () => {
    chrome.storage.local.get
      // @ts-ignore
      .mockResolvedValueOnce({ accountState });
    await syncToDwn("test", "AccountState");
    const opt = fetchMock.lastOptions();
    expect(opt?.method).toBe("post");
    const body = (opt?.body as unknown as string) || "";
    const { messages } = JSON.parse(body);
    expect(messages.length).toBe(1);
    const { descriptor, encodedData } = messages[0] as CollectionsWriteMessage;
    expect(descriptor.target).toBe(person.didState.longForm);
    expect(descriptor.schema).toBe("AccountState");
    expect(descriptor.published).toBe(false);
    const decoded = JSON.parse(base64url.decode(encodedData || ""));
    const { encryptedVault, ...rest } = accountState;
    expect(decoded).toStrictEqual({ ...rest });
  });
  test("sync verification history", async () => {
    const party: FirstParty<Providable> & Providable = {
      id: uuidv4(),
      date: new Date().toISOString(),
      url: profile1.profile.sub,
      did: did1.longForm,
      consentToProvide: true,
      verified: "ok",
      originatorProfile: profile1.profile,
      thirdParties: [
        {
          id: uuidv4(),
          date: new Date().toISOString(),
          did: did2.longForm,
          verified: "ok",
          consentToProvide: true,
          originatorProfile: profile2.profile,
        },
      ],
    };
    const verifiedContext = {
      [party.url]: party,
    };
    chrome.storage.local.get
      // @ts-ignore
      .mockResolvedValueOnce({ accountState })
      .mockResolvedValueOnce({ verifiedContext });
    await syncToDwn("test", "VerificationHistory");
    const opt = fetchMock.lastOptions();
    expect(opt?.method).toBe("post");
    const body = (opt?.body as unknown as string) || "";
    const { messages } = JSON.parse(body);
    expect(messages.length).toBe(1);
    const { descriptor, encodedData } = messages[0] as CollectionsWriteMessage;
    expect(descriptor.target).toBe(person.didState.longForm);
    expect(descriptor.schema).toBe("VerificationHistory");
    expect(descriptor.published).toBe(false);
    const decoded = JSON.parse(base64url.decode(encodedData || ""));
    expect(decoded[party.url]).toStrictEqual(party);
  });
  test("sync providing history", async () => {
    const providedHistories = { histories: [], globalAdId: "" };
    chrome.storage.local.get
      // @ts-ignore
      .mockResolvedValueOnce({ accountState })
      .mockResolvedValueOnce({ providedHistories });
    await syncToDwn("test", "ProvidingHistory");
    const opt = fetchMock.lastOptions();
    expect(opt?.method).toBe("post");
    const body = (opt?.body as unknown as string) || "";
    const { messages } = JSON.parse(body);
    expect(messages.length).toBe(1);
    const { descriptor, encodedData } = messages[0] as CollectionsWriteMessage;
    expect(descriptor.target).toBe(person.didState.longForm);
    expect(descriptor.schema).toBe("ProvidingHistory");
    expect(descriptor.published).toBe(false);
    const decoded = JSON.parse(base64url.decode(encodedData || ""));
    expect(decoded).toStrictEqual(providedHistories);
  });
});
