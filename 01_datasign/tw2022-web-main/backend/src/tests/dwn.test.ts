import { assert, expect } from "chai";
import pkg from "elliptic";
import base64url from "base64url";

import { createWriteMessage } from "../dwn";

const { ec: EC } = pkg;

describe("createWriteMessage", () => {
  it("createWriteMessage", async () => {
    const target = "did:ion:123";
    const recipient = "did:ion:456";
    const ec = new EC("secp256k1");
    const key = ec.genKeyPair();
    const d = base64url.encode(key.getPrivate().toArrayLike(Buffer, "be", 32));
    const privateJwk = {
      kty: "EC",
      crv: "secp256k1",
      x: key.getPublic().getX().toString("hex"),
      d,
    };
    const messageHandler = await createWriteMessage(
      target,
      recipient,
      "dummy",
      privateJwk
    );
    const { descriptor } = messageHandler.message;
    const { method } = descriptor;

    assert.equal(method, "CollectionsWrite");
  });
});
