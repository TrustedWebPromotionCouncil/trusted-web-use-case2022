/**
 * @jest-environment ./jest-custom-environment
 */
import fetchMock from "fetch-mock";
import base64url from "base64url";
import ec from "../../src/keys/elliptic";

import { SingleHDKeyRingController } from "../../src/keyRing/SingleHDKeyRingController";
import { writeMessage, queryMessage } from "./dwnClient";
import { generateDid } from "../test/fixtures";

const testPassword = "test-password";

describe("dwn client", () => {
  let initState = { vault: "" };
  const url = "https://dummy-site.com";
  const dwnLocation = "https://dwn.exampl.com";

  beforeAll(async () => {
    const keyRingController = new SingleHDKeyRingController();
    await keyRingController.createNewVault(testPassword);
    initState.vault = keyRingController.encryptedVault;
  });

  test("writeMessage", async () => {
    fetchMock.post(dwnLocation, {
      status: 200,
      body: {
        status: {
          code: 200,
          message: "OK",
        },
      },
    });
    const keyRingController = new SingleHDKeyRingController({ initState });
    await keyRingController.unlock(testPassword);
    const address = await keyRingController.getAccounts();
    const privateKeyHex = await keyRingController.getPrivateKey(address[0]);
    const res = await writeMessage(
      {
        didState: { longForm: "did:ion:123" },
        privateKeyHex,
        dwnLocation,
      },
      "did:ion:456",
      JSON.stringify({ data: "dummy" })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status.code).toBe(200);
    expect(body.status.message).toBe("OK");
    expect(fetchMock.called(dwnLocation)).toBe(true);
    fetchMock.restore();
  });

  test("queryMessage", async () => {
    const did1 = generateDid();
    const did2 = generateDid();
    const data = "test";
    const encodedData = base64url.encode(data);
    fetchMock.post(dwnLocation, {
      status: 200,
      replies: [
        {
          status: 200,
          entries: [
            {
              descriptor: {
                dataCid:
                  "bafybeiaeq7vbezix4eru5lank4eudnitifcmhgkr4qwsgmqoznygspcf4q",
                dataFormat: "application/json",
                dateCreated: "2023-02-14T07:26:06.694000",
                method: "CollectionsWrite",
                recipient: did2.longForm,
                recordId: "693e635a-3c45-49dd-a842-515eb8802eb8",
                target: did1.shortForm,
              },
              encodedData,
            },
          ],
        },
      ],
    });
    const keyRingController = new SingleHDKeyRingController({ initState });
    await keyRingController.unlock(testPassword);
    const address = await keyRingController.getAccounts();
    const privateKeyHex = await keyRingController.getPrivateKey(address[0]);
    const target = {
      did: did1.shortForm,
      dwnLocation,
    };
    const recipient = {
      did: did2.longForm,
      privateKeyJwk: ec.privateKeyHexToJwk(privateKeyHex),
      keyId: "key-1",
    };
    const filter = {
      recipient: did1.longForm,
    };
    const reply = await queryMessage(target, recipient, filter);
    expect(reply.status).toBe(200);
    expect(reply.entries!.length).toBe(1);
    expect(reply.entries![0].data).toBe(data);
    expect(fetchMock.called(dwnLocation)).toBe(true);
    fetchMock.restore();
  });
});
