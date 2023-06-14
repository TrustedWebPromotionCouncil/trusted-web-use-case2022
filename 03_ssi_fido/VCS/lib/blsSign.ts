import {
  generateBls12381G2KeyPair,
  BbsSignRequest,
  BlsBbsSignRequest,
  sign,
  bls12381toBbs,
  BBS_SIGNATURE_LENGTH,
  BbsKeyPair,
  BlsKeyPair,
} from "@mattrglobal/bbs-signatures";
import { base64Encode, base64Decode, stringToBytes } from "./utility";
  

async function blsSign(
    pk: string,
    sk: string,
    messages: string[]) : Promise<string>{

    /* Setup for messages, pk, and sk */
    const messages_ = [];
    for (const message of messages) {
      messages_.push(Uint8Array.from(Buffer.from(message, "utf-8")));
    }

    const pk_d = base64Decode(pk);
    const sk_d = base64Decode(sk);
    
    /* Setup for the BlsKeyPair */
    const blsKeyPair: BlsKeyPair = {
      publicKey: pk_d,
      secretKey: sk_d,

    };

     /* Generating a BbsKeyPair using the BlsKeyPair & messageCount */
    const bbsKeyPair: BbsKeyPair = await bls12381toBbs({
        keyPair: blsKeyPair,
        messageCount: messages.length,
    });

  
    /* Setting the request format */
    const request: BbsSignRequest = {
      keyPair: bbsKeyPair,
      messages: messages_,
    };

    /* Forecast the request to the API sign() function & obtain the result */
    const proof = await sign(request);

    return base64Encode(proof);
  
}

export default blsSign;