import { assert } from "chai";
import request from "supertest";
import sinon from "sinon";
import base64url from "base64url";
import {
  CollectionsWriteMessage,
  DidIonResolver,
  Response,
} from "@tbd54566975/dwn-sdk-js";
import app from "../routes/app";
import testUtils, { Person } from "./utils";
import keys from "../services/keys";
import { ACCESS_LOG_SCHEMA } from "../services/accessLog";

const PERSONAL_DATA_SCHEMA = "https://schema.org/PersonalData";
const PERSONAL_DATA_SCHEMA1 = "https://schema.org/PersonalData1";
const PERSONAL_DATA_SCHEMA2 = "https://schema.org/PersonalData2";

const did = "did:ion:EiAw_4xUJeRd2Xyz4jDS1um1HTCnBS6bEq3Yi5AQDNkftA";
const did2 = "did:ion:EiBSv45jVd7CzYQD7V7QSNl2m64NRPv4dhEE6ug6LnhKig";
const did3 = "did:ion:EiDlfI0dYMxqkjiefdLWucLv2BSb5a8LaIZOVcxTYHkQmw";

const APP_SIGN_KEY = process.env.APP_SIGN_KEY!;
const keyPair = keys.privateKeyToKeyPair(APP_SIGN_KEY, "secp256k1");
const dWebApp = testUtils.generateUser("did:ion:999", undefined, keyPair);

const payload = { vc: { foo: 0 } };

const fakeDidDocument = (didSubject: Person) => {
  return {
    didDocument: {
      id: didSubject.did,
      verificationMethod: [
        testUtils.generateFakeVerificationMethod(didSubject),
      ],
      authentication: ["#keys-1"],
    },
    didDocumentMetadata: {},
    didResolutionMetadata: {},
  };
};
const stubDidResolver = (didSubjects: Person[]) => {
  const stub = sinon.stub(DidIonResolver.prototype as any, "resolve");
  for (let i = 0; i < didSubjects.length; i++) {
    stub.onCall(i).returns(Promise.resolve(fakeDidDocument(didSubjects[i])));
  }
  return stub;
};

describe("Published Record", () => {
  const owner = testUtils.generateUser(did);
  const consumer = testUtils.generateUser(did2);
  const recordId = "77b55137-5994-4c4a-a8dc-4a354a2efc69";
  before(async () => {
    console.debug(
      "--------------- before hook starts(Published Record) -----------------"
    );
    const stub = stubDidResolver([owner]);
    const writeMessage = await testUtils.generatePublishedRecordWriteMessage(
      owner,
      payload,
      {
        schema: "https://schema.org/SocialMediaPosting",
        recordId,
        datePublished: new Date().getTime(),
      }
    );
    const response = await request(app.callback())
      .post("/")
      .send({
        messages: [writeMessage],
      });
    assert.equal(response.status, 200);
    stub.restore();
    console.debug("--------------- before hook ends -----------------");
  });

  it("can read published record", async () => {
    const stub = stubDidResolver([consumer]);
    const queryMessage = await testUtils.generateCollectionsQueryMessage(
      consumer,
      owner,
      {
        schema: "https://schema.org/SocialMediaPosting",
      }
    );
    const response = await request(app.callback())
      .post("/")
      .send({
        messages: [queryMessage],
      });
    assert.equal(response.status, 200);

    const httpResponse: Response = response.body;
    assert.equal(httpResponse.replies!.length, 1);

    const entry = httpResponse.replies![0].entries![0];
    const { encodedData, descriptor } = entry as CollectionsWriteMessage;
    const content = JSON.parse(base64url.decode(encodedData!));
    assert.equal(descriptor.dataFormat, "application/json");
    assert.equal(content.vc.foo, payload.vc.foo);
    stub.restore();
  });
  it("can not read published record with unmatched filter condition", async () => {
    const stub = stubDidResolver([consumer]);
    const queryMessage = await testUtils.generateCollectionsQueryMessage(
      consumer,
      owner,
      {
        schema: "https://schema.org/NoSushSchema",
      }
    );
    const response = await request(app.callback())
      .post("/")
      .send({
        messages: [queryMessage],
      });
    assert.equal(response.status, 200);

    const httpResponse: Response = response.body;
    assert.equal(httpResponse.replies!.length, 1);
    const { status, entries } = httpResponse.replies![0];
    assert.equal(status.code, 200);
    assert.equal(entries!.length, 0);
    stub.restore();
  });
});

describe("UnPublished Record", () => {
  const provider = testUtils.generateUser(did);
  const recipient = testUtils.generateUser(did2);
  const notRecipient = testUtils.generateUser(did3);

  const recordId = "ef1baa70-5c17-4594-a5db-376df4f072de";
  before(async () => {
    console.debug(
      "--------------- before hook starts(UnPublished Record) -----------------"
    );
    const stub = stubDidResolver([provider]);
    const writeMessage = await testUtils.generateUnPublishedRecordWriteMessage(
      provider,
      recipient,
      payload,
      {
        schema: PERSONAL_DATA_SCHEMA1,
        recordId,
      }
    );
    const response = await request(app.callback())
      .post("/")
      .send({
        messages: [writeMessage],
      });
    assert.equal(response.status, 200);

    stub.restore();
    console.debug("--------------- before hook ends -----------------");
  });

  it("can read unpublished record (for recipient)", async () => {
    const stub = stubDidResolver([recipient, dWebApp]);
    const queryMessage = await testUtils.generateCollectionsQueryMessage(
      recipient,
      provider,
      {
        schema: PERSONAL_DATA_SCHEMA1,
      }
    );
    const response = await request(app.callback())
      .post("/")
      .send({
        messages: [queryMessage],
      });
    assert.equal(response.status, 200);

    const httpResponse: Response = response.body;
    assert.equal(httpResponse.replies!.length, 1);

    const entry = httpResponse.replies![0].entries![0];
    const { encodedData, descriptor } = entry as CollectionsWriteMessage;
    const content = JSON.parse(base64url.decode(encodedData!));
    assert.equal(descriptor.dataFormat, "application/json");
    assert.equal(content.vc.foo, payload.vc.foo);
    stub.restore();
  });
  it("can not read unpublished record (for not recipient)", async () => {
    const stub = stubDidResolver([notRecipient]);
    const queryMessage = await testUtils.generateCollectionsQueryMessage(
      recipient,
      provider,
      {
        schema: PERSONAL_DATA_SCHEMA1,
      }
    );
    const response = await request(app.callback())
      .post("/")
      .send({
        messages: [queryMessage],
      });
    assert.equal(response.status, 200);
    const httpResponse: Response = response.body;
    assert.equal(httpResponse.replies?.length, 1);
    assert.equal(httpResponse.replies![0].status.code, 401);
    stub.restore();
  });
  it("can read unpublished record (for author)", async () => {
    const stub = stubDidResolver([provider, dWebApp]);
    const queryMessage = await testUtils.generateCollectionsQueryMessage(
      provider,
      provider,
      {
        schema: PERSONAL_DATA_SCHEMA1,
      }
    );
    const response = await request(app.callback())
      .post("/")
      .send({
        messages: [queryMessage],
      });
    assert.equal(response.status, 200);

    const httpResponse: Response = response.body;
    assert.equal(httpResponse.replies!.length, 1);

    const entry = httpResponse.replies![0].entries![0];
    const { encodedData, descriptor } = entry as CollectionsWriteMessage;
    const content = JSON.parse(base64url.decode(encodedData!));
    assert.equal(descriptor.dataFormat, "application/json");
    assert.equal(content.vc.foo, payload.vc.foo);
    stub.restore();
  });
});

describe("Access Log", () => {
  const provider = testUtils.generateUser(did);
  const recipient = testUtils.generateUser(did2);

  const recordId1 = "ef1baa70-5c17-4594-a5db-376df4f072de";
  const recordId2 = "66ff604b-54fd-451f-87c4-1882356655e9";
  before(async () => {
    console.debug(
      "--------------- before hook starts(Access Log) -----------------",
      process.cwd()
    );
    // await rm("./BLOCKSTORE", { recursive: true, force: true });
    // await rm("./INDEX", { recursive: true, force: true });
    // write data
    const stub = stubDidResolver([provider, provider]);
    const writeMessage1 = await testUtils.generateUnPublishedRecordWriteMessage(
      provider,
      recipient,
      payload,
      {
        schema: PERSONAL_DATA_SCHEMA1,
        recordId: recordId1,
      }
    );
    const writeMessage2 = await testUtils.generateUnPublishedRecordWriteMessage(
      provider,
      recipient,
      payload,
      {
        schema: PERSONAL_DATA_SCHEMA2,
        recordId: recordId2,
      }
    );
    let response = await request(app.callback())
      .post("/")
      .send({
        messages: [writeMessage1, writeMessage2],
      });
    assert.equal(response.status, 200);
    stub.restore();

    // read data
    const stub2 = stubDidResolver([recipient, recipient, dWebApp, dWebApp]);
    const queryMessage1 = await testUtils.generateCollectionsQueryMessage(
      recipient,
      provider,
      {
        schema: PERSONAL_DATA_SCHEMA1,
      }
    );
    const queryMessage2 = await testUtils.generateCollectionsQueryMessage(
      recipient,
      provider,
      {
        schema: PERSONAL_DATA_SCHEMA2,
      }
    );
    response = await request(app.callback())
      .post("/")
      .send({
        messages: [queryMessage1, queryMessage2],
      });
    assert.equal(response.status, 200);
    const httpResponse: Response = response.body;
    assert.equal(httpResponse.replies!.length, 2);
    stub2.restore();
    console.debug("--------------- before hook ends -----------------");
  });
  it("can read access log (for recipient)", async () => {
    const stub = stubDidResolver([provider]);
    const queryMessage = await testUtils.generateCollectionsQueryMessage(
      provider,
      dWebApp,
      {
        schema: ACCESS_LOG_SCHEMA,
      }
    );
    const response = await request(app.callback())
      .post("/")
      .send({
        messages: [queryMessage],
      });
    assert.equal(response.status, 200);

    const httpResponse: Response = response.body;
    assert.equal(httpResponse.replies!.length, 1);

    // 1st data
    const { entries } = httpResponse.replies![0];
    assert.isAtLeast(entries!.length, 2);

    for (const entry of entries!) {
      console.debug({ entry });
      assert.isAtLeast(entries!.length, 2);
      const { encodedData, descriptor } = entry as CollectionsWriteMessage;
      assert.equal(descriptor.schema, ACCESS_LOG_SCHEMA);
      assert.equal(descriptor.dataFormat, "application/json");
      const content = JSON.parse(base64url.decode(encodedData!));
      if (content.accessor !== provider.did) {
        // ignore own data access log
        assert.equal(content.accessor, recipient.did);
      }
      assert.isTrue(content.schema.startsWith(PERSONAL_DATA_SCHEMA));
      console.log(content.schema, content.recordId);
    }

    stub.restore();
  });
});
