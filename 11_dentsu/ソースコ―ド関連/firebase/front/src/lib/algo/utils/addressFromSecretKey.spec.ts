import { describe, it, expect } from 'vitest';

import * as didJwtKit from 'did-jwt-toolkit';

import addressFromSecretKey from './addressFromSecretKey';

const driver = didJwtKit.getDIDKeyDriver('EdDSA');

describe('algods', () => {
  it('should work', async () => {
    const { secretKey } = driver.generateKeyPair();

    expect(addressFromSecretKey(secretKey).length).toEqual(58);
  });
});
