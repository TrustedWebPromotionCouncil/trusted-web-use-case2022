import ION from "@decentralized-identity/ion-tools";

import keys from "../keys/elliptic";
import { DIDState } from "../did/types";

const issueDID = async (privateKey: string, dwnLocation: string) => {
  const privateJwk = keys.privateKeyHexToJwk(privateKey, {
    kty: "EC",
    crv: "secp256k1",
  });
  const { d, ...rest } = privateJwk;
  const publicKeyJwk = { ...rest };
  const did = new ION.DID({
    content: {
      publicKeys: [
        {
          id: "key-1",
          type: "JsonWebKey2020",
          publicKeyJwk,
          purposes: ["authentication", "keyAgreement"],
        },
      ],
      services: [
        {
          id: "dwn",
          type: "DecentralizedWebNode",
          serviceEndpoint: {
            nodes: [dwnLocation],
          },
        },
      ],
    },
  });
  const didState = (await did.getState()) as DIDState;
  // https://github.com/decentralized-identity/ion-cli/blob/main/src/commands/publish.ts
  // https://github.com/decentralized-identity/ion-tools#generaterequest-async
  const requestBody = await did.generateRequest();
  const request = new ION.AnchorRequest(requestBody);
  await request.submit();

  return didState;
};

export default { issueDID };
