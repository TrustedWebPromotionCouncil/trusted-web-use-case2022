import { SingleHDKeyRingController } from "../../src/keyRing/SingleHDKeyRingController";

export const getAccount = async (
  keyRingController: SingleHDKeyRingController,
  index = 0
) => {
  const address = await keyRingController.getAccounts();
  const privateKeyHex = await keyRingController.getPrivateKey(address[index]);
  return { address, privateKeyHex };
};

export const issuePairwiseAccount = async (
  keyRingController: SingleHDKeyRingController,
  issuedPairwiseAccountCount: number
) => {
  // index 0 is master account
  for (let i = 1; i <= issuedPairwiseAccountCount; i++) {
    await keyRingController.addAccount(); // re-produce
  }
  const address = await keyRingController.addAccount(); // new address
  const privateKeyHex = await keyRingController.getPrivateKey(address);
  return { address, privateKeyHex };
};

export const reProducePairwiseAccount = async (
  keyRingController: SingleHDKeyRingController,
  count: number
) => {
  const ret: { [key: string]: string } = {};
  const addresses = await keyRingController.getAccounts();
  if (addresses.length === 1 || addresses.length === count + 1) {
    for (let i = 1; i <= count; i++) {
      let address = "";
      if (addresses.length === 1) {
        address = await keyRingController.addAccount(); // re-produce accounts
      } else {
        address = addresses[i];
      }
      const privateKeyHex = await keyRingController.getPrivateKey(address);
      ret[address] = privateKeyHex;
    }
    return ret;
  } else {
    throw new Error("Illegal keyRingController is specified");
  }
};

export default {
  getAccount,
  issuePairwiseAccount,
  reProducePairwiseAccount,
};
