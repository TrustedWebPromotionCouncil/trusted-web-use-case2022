import {
    generateBls12381G2KeyPair,
  } from "@mattrglobal/bbs-signatures";
  import { base64Encode, base64Decode, stringToBytes } from "./utility";
  
  //Generate a new key pair
  async function createBbsKeyPair() : Promise<object>{
      
    const keyPair = await generateBls12381G2KeyPair();
    return {
        "publicKey": base64Encode(keyPair.publicKey),
        "secretKey": base64Encode(keyPair.secretKey)
    };
}

export default createBbsKeyPair;