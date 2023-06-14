import {
    blsVerify,
  } from "@mattrglobal/bbs-signatures";
  import { base64Encode, base64Decode, stringToBytes } from "./utility";
  
  //Generate a new key pair
  async function getBlsVerifiedResult(
    signature: string,
    publicKey: string,
    messages: string[],
  ) : Promise<object>{

    //Derive a proof from the signature revealing the first message
    const messages_ = [];
    for (const message of messages) {
      messages_.push(Uint8Array.from(Buffer.from(message, "utf-8")));
    }
      
    const result = await blsVerify({
        publicKey: base64Decode(publicKey),
        messages: messages_,
        signature: base64Decode(signature)});
    return result;
}

export default getBlsVerifiedResult;