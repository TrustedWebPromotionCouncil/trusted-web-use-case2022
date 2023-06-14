import nacl from 'tweetnacl';

export const randomBytes = (length: number) => {
  return nacl.randomBytes(length);
};

export const randomSeed = () => {
  return randomBytes(nacl.box.secretKeyLength);
};

export const keyPairFromSeed = (seed: Uint8Array) => {
  return nacl.sign.keyPair.fromSeed(seed);
};

export const keyPair = () => {
  const seed = randomSeed();
  return keyPairFromSeed(seed);
};

export const seedFromSecretKey = (secretKey: Uint8Array) => {
  return secretKey.slice(0, nacl.sign.seedLength);
};

export const publicKeyFromSecretKey = (secretKey: Uint8Array) => {
  return secretKey.slice(nacl.sign.seedLength);
};

export const sign = (message: Uint8Array, secretKey: Uint8Array) => {
  return nacl.sign.detached(message, secretKey);
};

export const verify = (
  message: Uint8Array,
  signature: Uint8Array,
  verifyKey: Uint8Array
) => {
  return nacl.sign.detached.verify(message, signature, verifyKey);
};
