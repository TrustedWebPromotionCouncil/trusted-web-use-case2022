import { describe, it, expect } from 'vitest';

import {
  genericHash,
  createKey,
  encrypt,
  decrypt,
  encryptByPassword,
  decryptByPassword,
} from './cryptUtils';

describe('cryptUtils', () => {
  it('genericHash should work', () => {
    expect(genericHash('abcdefgh').length).to.eq(32);
  });

  it('createKey should work', () => {
    const key = createKey('abcdefgh');
    expect(key.length).to.eq(32);
  });

  it('encrypt should work', () => {
    const data = new TextEncoder().encode('Hello');
    const key = createKey('abcdefgh');
    const encData = encrypt(data, key);

    expect(encData).to.not.empty;
  });

  it('decrypt should work', () => {
    const data = new TextEncoder().encode('Hello');
    const key = createKey('abcdefgh');
    const encData = encrypt(data, key);

    expect(decrypt(encData, key)).to.eql(data);
  });

  it('encryptByPassword should work', () => {
    expect(encryptByPassword(new TextEncoder().encode('Hello'), 'abcdefgh')).to
      .not.empty;
  });

  it('decryptByPassword should work', () => {
    const data = new TextEncoder().encode('Hello');
    const password = 'abcdefgh';
    const encData = encryptByPassword(data, password);
    expect(decryptByPassword(encData, password)).to.eql(data);
  });
});
