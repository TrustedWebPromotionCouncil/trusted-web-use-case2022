import ION from "@decentralized-identity/ion-tools";
import { JWK } from "jose/jwk/thumbprint";

import { getKeyPair as getDBKeyPair, saveNewKeyPair } from "../../repository/store";

export interface KeyPair {
  publicJwk: JWK;
  privateJwk: JWK;
}
export const initKeyPair = async () => {
  const keyPair: KeyPair = await ION.generateKeyPair();
  if (!(await getDBKeyPair())) {
    await saveNewKeyPair(keyPair);
  }
};

export const getKeyPair = async (): Promise<KeyPair> => {
  const keyPair = await getDBKeyPair();
  return keyPair as KeyPair;
};
