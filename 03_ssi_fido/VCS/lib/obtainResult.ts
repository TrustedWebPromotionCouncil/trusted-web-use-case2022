import {blsVerifyProof, BbsVerifyProofRequest} from "@mattrglobal/bbs-signatures";
import { base64Encode, base64Decode, stringToBytes } from "./utility";
  

async function obtainResult(
    proof: string,
    publicKey: string,
    messages: string[],
    nonce: string) : Promise<string>{
      
    const messages_ = [];
    for (const message of messages) {
      messages_.push(Uint8Array.from(Buffer.from(message, "utf-8")));
    }

    /* Format for the HTTP request */
    const request: BbsVerifyProofRequest = {
      proof: base64Decode(proof),
      publicKey: base64Decode(publicKey),
      messages: messages_,
      nonce: stringToBytes(nonce),
    };

    /* Obtain the verification result using the blsVerifyProof function */
    const isProofVerified_ori = await blsVerifyProof(request);
    const isProofVerified = JSON.stringify(isProofVerified_ori);


    return isProofVerified;
  
}

export default obtainResult;