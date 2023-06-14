import * as sha512 from 'js-sha512';
import * as pbkdf2 from 'pbkdf2';
import * as aesjs from 'aes-js';
import * as tweetnacl from 'tweetnacl';

export function genericHash(message: sha512.Message) {
  return sha512.sha512_256.array(message);
}

export const createKey = (password: string) => {
  const salt = Uint8Array.from(genericHash(password));

  return pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha512');
};

export const encrypt = (data: Uint8Array, key: Uint8Array) => {
  const iv = tweetnacl.randomBytes(16);

  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const encBody = aesCbc.encrypt(aesjs.padding.pkcs7.pad(data));

  const ret = new Uint8Array(iv.length + encBody.length);
  ret.set(iv);
  ret.set(encBody, iv.length);

  return ret;
};

export const decrypt = (encData: Uint8Array, key: Uint8Array) => {
  const iv = encData.subarray(0, 16);
  const encBody = encData.subarray(16);

  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);

  return aesjs.padding.pkcs7.strip(aesCbc.decrypt(encBody));
};

export const encryptByPassword = (data: Uint8Array, password: string) => {
  const key = createKey(password);

  return encrypt(data, key);
};

export const decryptByPassword = (encData: Uint8Array, password: string) => {
  const key = createKey(password);

  return decrypt(encData, key);
};
