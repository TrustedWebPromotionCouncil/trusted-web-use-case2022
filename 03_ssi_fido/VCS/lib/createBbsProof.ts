import {blsCreateProof} from "@mattrglobal/bbs-signatures";
import { base64Encode, base64Decode, stringToBytes } from "./utility";
  

async function createBbsProof(
    signature: string,
    publicKey: string,
    messages: string[],
    revealed: number[],
    nonce: string) : Promise<string>{
      
    //Derive a proof from the signature revealing the first message
    const messages_ = [];
    for (const message of messages) {
      messages_.push(Uint8Array.from(Buffer.from(message, "utf-8")));
    }

    //Derive a proof from the signature revealing the first message
    const proof = await blsCreateProof({
      signature: base64Decode(signature),
      publicKey: base64Decode(publicKey),
      messages: messages_,
      nonce: stringToBytes(nonce),
      revealed: revealed,
    });
    return base64Encode(proof);
  
}

export default createBbsProof;