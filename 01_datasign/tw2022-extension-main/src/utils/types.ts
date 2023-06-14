import { PublicJwk } from "../keys/types";
import { DIDState } from "../did/types";

export type { DIDState };
export interface Person {
  didState: Pick<DIDState, "longForm" | "shortForm">;
  dwnLocation?: string;
}

export interface IssuablePerson extends Person {
  privateKeyHex: string;
}

export interface VerifiablePerson extends Person {
  publicKeyJwk: PublicJwk;
}
