import {
  Issuer,
  JwtCredentialPayload,
  createVerifiableCredentialJwt,
  verifyCredential,
} from "did-jwt-vc";

import { ionResolver } from "./resolver";
import jwtHandler from "./utils/jwt";

const issueNotBotVC = async (subjectId: string) => {
  const issuerId = process.env.APP_SIGN_DID!;
  const b64PrivateKey = process.env.APP_SIGN_KEY!;
  const alg = "ES256K";
  const signer = jwtHandler.getSigner(b64PrivateKey, alg);
  const issuer: Issuer = {
    did: issuerId,
    alg,
    signer,
  };
  const vcPayload: JwtCredentialPayload = {
    sub: subjectId,
    // nbf: a UNIX timestamp when this VC is issued
    nbf: Math.floor(new Date().getTime() / 1000),
    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://schema.org",
      ],
      type: ["VerifiableCredential"],
      credentialSubject: {
        name: "re-captcha-test",
        agent: { name: subjectId },
        result: true,
      },
    },
  };
  const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
  return vcJwt;
};

const verifyVC = async (vcJwt: string) => {
  const { verifiableCredential } = await verifyCredential(vcJwt, ionResolver);
  return verifiableCredential;
};

export default { issueNotBotVC, verifyVC };
