import { PrivateJwk, PublicJwk } from "@/keys/types";

export interface DIDState {
  longForm: string;
  shortForm: string;
  ops: {
    operation: string;
    update: {
      privateKwk: PrivateJwk;
      publicKwk: PublicJwk;
    };
    recovery: {
      privateKwk: PrivateJwk;
      publicKwk: PublicJwk;
    };
  };
}
