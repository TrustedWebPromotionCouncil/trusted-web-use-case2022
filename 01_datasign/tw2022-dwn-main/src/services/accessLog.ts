import base64url from "base64url";
import { v4 as uuidv4 } from "uuid";
import pkg from "elliptic";
import {
  CollectionsWriteMessage,
  CollectionsWrite,
  DidResolver,
  Response,
  PrivateJwk,
} from "@tbd54566975/dwn-sdk-js";
import { RequestSchema } from "@tbd54566975/dwn-sdk-js/dist/esm/src/core/types";
import { MessageStore } from "@tbd54566975/dwn-sdk-js/dist/esm/src/store/message-store";
import { handleCollectionsWrite } from "../../node_modules/@tbd54566975/dwn-sdk-js/dist/esm/src/interfaces/collections/handlers/collections-write";

import keys from "./keys";

const { ec: EC } = pkg;

export const ACCESS_LOG_SCHEMA = "https://schema.org/AccessLog";

class AccessLogger {
  private appPrivateJwk;
  private accessor;
  private response;
  private config;
  constructor(
    content: Uint8Array,
    response: Response,
    config: { messageStore: MessageStore; didResolver: DidResolver }
  ) {
    this.appPrivateJwk = _getAppPrivateJwk();
    this.accessor = _getAccessorDid(content);
    this.response = response;
    this.config = config;
  }

  async save() {
    /*
    data layout is like this.
    [
      [{ entry1 }, { entry2 }, ...],             <- reply1
      [{ entry1 }],                              <- reply2
      [{ entry1 }, { entry2 }, { entry3 }, ...], <- reply3
      ...
    ]
     */
    for (const entries of _collectRepliesReadByRecipient(this.response)) {
      for (const entry of entries) {
        console.debug("save access log", entry);
        const message = await _createWriteMessage(
          entry,
          this.accessor,
          this.appPrivateJwk
        );
        const { messageStore, didResolver } = this.config;
        // save
        const reply = await handleCollectionsWrite(
          message,
          messageStore,
          didResolver
        );
        if (400 <= reply.status.code) {
          const { code, detail } = reply.status;
          throw new Error(
            `Got unexpected reply status -> code: ${code}, detail: ${detail}`
          );
        }
      }
    }
  }
}

const _getAppPrivateJwk = () => {
  const keyPair = keys.privateKeyToKeyPair(
    process.env.APP_SIGN_KEY!,
    "secp256k1"
  );
  return keys.toPrivateJwk(keyPair);
};

const _getAccessorDid = (content: Uint8Array) => {
  const textDecoder = new TextDecoder();
  const requestString = textDecoder.decode(content);
  const request: RequestSchema = JSON.parse(requestString);
  const requestMessage = request.messages[0]; // assuming that one request does not include multiple accessor.
  const { authorization } = requestMessage;
  const protectedHeader = base64url.decode(
    authorization.signatures[0].protected
  );
  const { kid } = JSON.parse(protectedHeader);
  const [accessorDid] = kid.split("#");
  return accessorDid;
};

const _collectRepliesReadByRecipient = (response: Response) => {
  const replies: CollectionsWriteMessage[][] = [];
  for (const reply of response.replies || []) {
    const { status, entries } = reply;
    if (status.code === 200 && entries) {
      const writeMessages = entries.filter((entry) => {
        const { method } = entry.descriptor;
        if (method === "CollectionsWrite") {
          // if the response message method is `CollectionWrite` then its request method should be `CollectionQuery`.
          // therefore this request needs to be saved as access log.
          const { descriptor } = entry as CollectionsWriteMessage;
          const { published, schema } = descriptor;
          // exclude not private or access log message
          return published === false && schema !== ACCESS_LOG_SCHEMA;
        } else {
          return false;
        }
      });
      replies.push(writeMessages as CollectionsWriteMessage[]);
    }
  }
  return replies;
};

const _createWriteMessage = async (
  entry: CollectionsWriteMessage,
  accessorDid: string,
  appJwkPrivate: PrivateJwk
) => {
  const APP_SIGN_DID = process.env.APP_SIGN_DID!;

  const { recordId, dateCreated, schema, target } = (
    entry as CollectionsWriteMessage
  ).descriptor;
  const signatureInput = {
    protectedHeader: {
      alg: "ES256K",
      kid: `${APP_SIGN_DID}#key-1`,
    },
    jwkPrivate: appJwkPrivate,
  };
  const data = JSON.stringify({
    accessor: accessorDid,
    recordId,
    schema,
  });
  console.debug({ data });
  // in the future, target is personal data owner.
  // (until `permission grant function is implemented by dwn sdk)
  const opt = {
    target: APP_SIGN_DID,
    recipient: target,
    recordId: uuidv4(),
    schema: ACCESS_LOG_SCHEMA,
    data: new TextEncoder().encode(data),
    dataFormat: "application/json",
    published: false,
    signatureInput,
  };
  const writeMessage = await CollectionsWrite.create(opt);
  // console.log(writeMessage.toJSON());
  return writeMessage.message;
};

export default AccessLogger;
