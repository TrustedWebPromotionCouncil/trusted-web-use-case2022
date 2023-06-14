import { assert } from "chai";

import store from "../store";
import { afterEach } from "mocha";

const did1 = "did:example:123";
const holderInfo1 = {
  holderProfile: {
    name: "value1",
  },
  expire: 30,
};
const holderInfo2 = {
  holderProfile: {
    name: "value2",
  },
  expire: 365,
};

describe("store", () => {
  before(async () => {
    await store.createDb();
  });
  after(async () => {
    await store.destroyDb();
  });

  beforeEach(async () => {
    await store.insertVerifiedDID(did1);
    await store.insertHoldersProfile(holderInfo1);
    await store.insertHoldersProfile(holderInfo2);
  });
  afterEach(async () => {
    await store.deleteVerifiedDID(did1);
    await store.deleteHolderProfile(1);
    await store.deleteHolderProfile(2);
  });

  it("select row by registered did", async () => {
    const result = await store.selectVerifiedDID(did1);
    assert.equal(result?.did, did1);
  });

  it("select all from holders profile table", async () => {
    const resultAll = await store.selectALLHolderProfile();
    assert.equal(resultAll[0].rowid, 2);
    assert.equal(
      resultAll[0].profile,
      JSON.stringify(holderInfo2.holderProfile)
    );
    assert.equal(resultAll[0].expire, 365);

    assert.equal(resultAll[1].rowid, 1);
    assert.equal(
      resultAll[1].profile,
      JSON.stringify(holderInfo1.holderProfile)
    );
    assert.equal(resultAll[1].expire, 30);
  });
  it("select row by rowId from holders profile table", async () => {
    const result1 = await store.selectHolderProfile(1);
    assert.equal(result1?.expire, 30);
    const result2 = await store.selectHolderProfile(2);
    assert.equal(result2?.expire, 365);
  });

  it("select latest row by registered did", async () => {
    const prev = await store.selectVerifiedDID(did1); // past data
    await store.insertVerifiedDID(did1); // latest
    const result = await store.selectVerifiedDID(did1);
    assert.exists(result);
    assert.equal(result?.did, did1);
    assert.isAbove(result!.rowid, prev!.rowid);
  });

  it("select row by unregistered did", async () => {
    const no_such_did = "no-such-did";
    const result = await store.selectVerifiedDID(no_such_did);
    assert.equal(result, undefined);
  });

  it("select row by unregistered did from holders profile table", async () => {
    const result = await store.selectHolderProfile(0);
    assert.equal(result, undefined);
  });
});
