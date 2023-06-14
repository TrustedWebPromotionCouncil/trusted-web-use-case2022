export type CRV = "secp256k1" | "P-256" | "Ed25519";

export interface Jwk {
  kty: string;
  // https://www.rfc-editor.org/rfc/rfc7518.html#section-3.1
  alg?: string;
  kid?: string;
}
export interface PublicJwk extends Jwk {
  kty: "EC" | "OKP";
  // The crv type compatible with ion-tools
  // https://github.com/decentralized-identity/ion-tools#iongeneratekeypair-async
  crv: CRV;
  x: string;
  y?: string;
}

export interface PrivateJwk extends PublicJwk {
  d: string;
}

export interface JwkSet {
  keys: Jwk[];
}
