import ION from "@decentralized-identity/ion-tools";
import { JWK } from "jose/jwk/thumbprint";

import { DID_ION_KEY_ID } from "../configs/constants";
import { proxyHttpRequest } from "./http";

export interface KeyPair {
  publicJwk: JWK;
  privateJwk: JWK;
}

export interface VPOptions {
  vcs: string[];
  verifierDID: string;
  nonce?: string;
}

export interface SiopOptions {
  aud: string;
  contract?: string;
  attestations?: any;
  recipient?: string;
  vc?: string;
  nonce?: string;
  state?: string;
  nbf?: number;
  presentation_submission?: {
    descriptor_map?: [
      {
        id?: string;
        path?: string;
        encoding?: string;
        format?: string;
      }?
    ];
  };
}

export interface SiopV2Options {
  aud: string;
  nonce?: string;
  state?: string;
  nbf?: number;
  _vp_token?: {
    presentation_submission?: {
      id?: string;
      definition_id?: string;
      descriptor_map?: {
        path?: string;
        id?: string;
        format?: string;
        path_nested?: {
          id?: string;
          format?: string;
          path?: string;
        };
      }[];
    };
  };
}

export class Signer {
  siop = async (options: SiopOptions): Promise<string> => {
    return await proxyHttpRequest("post", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/siopRequest`, {
      options,
    }).then((res: { token: string }) => res.token);
  };

  siopV2 = async (options: SiopV2Options): Promise<string> => {
    return await proxyHttpRequest("post", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/siopV2Request`, {
      options,
    }).then((res: { token: string }) => res.token);
  };

  createVP = async (options: VPOptions): Promise<string> => {
    return await proxyHttpRequest("post", `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/vpRequest`, {
      options,
    }).then((res: { token: string }) => res.token);
  };
}
