import { describe, it, expect } from 'vitest';

import * as u8a from 'uint8arrays';
import * as didJwtKit from 'did-jwt-toolkit';

import * as cryptUtils from '../utils/cryptUtils';
import { test1Account, test2Account } from '../algo/account/secrets';
import { testNetAlgod as algod } from '../algo/algod/algods';
import { testNetAlgoIndexer as indexer } from '../algo/indexer/indexers';
import deleteApp from '../algo/api/deleteApp';
import deleteAllApps from '../algo/api/deleteAllApps';
import createRevokedApp from '../algo/api/createRevokedApp';
import setRevoked from '../algo/api/setRevoked';
import { getAppIndexes } from '../algo/api/deleteAllApps';

import * as didvc from '.';

const driver = didJwtKit.getDIDKeyDriver('EdDSA');
const issuerPw = '1234567';
const holderPw = '2345671';
const verifierPw = '3456712';

type MyCredential = {
  name: string;
};

describe('didvc', () => {
  it('encryptSecretKey should work', () => {
    const { secretKey } = driver.generateKeyPair();
    const encryptSecretKeyBase64URL = didvc.encryptSecretKey(
      secretKey,
      issuerPw
    );

    const encryptSecretKey = u8a.fromString(
      encryptSecretKeyBase64URL,
      'base64url'
    );

    const secretKey2 = cryptUtils.decryptByPassword(encryptSecretKey, issuerPw);

    expect(secretKey).toEqual(secretKey2);
  });

  it('decryptSecretKey should work', () => {
    const { secretKey } = driver.generateKeyPair();
    const encryptSecretKeyBase64URL = didvc.encryptSecretKey(
      secretKey,
      issuerPw
    );

    const secretKey2 = didvc.decryptSecretKey(
      encryptSecretKeyBase64URL,
      issuerPw
    );

    expect(secretKey).toEqual(secretKey2);
  });

  it('createDIDAccount should work', () => {
    const { did, address, encryptedSecretKey } =
      didvc.createDIDAccount(issuerPw);

    const secretKey = didvc.decryptSecretKey(encryptedSecretKey, issuerPw);

    expect(secretKey.length).toEqual(64);
    expect(did.startsWith('did:key:')).toBeTruthy();
    expect(address.length).toEqual(58);
  });

  it('issuerFromEncryptSecretKey should work', () => {
    const { encryptedSecretKey } = didvc.createDIDAccount(issuerPw);

    const { did, signer, alg } = didvc.issuerFromEncryptedSecretKey(
      encryptedSecretKey,
      issuerPw
    );

    expect(did.startsWith('did:key:')).toBeTruthy();
    expect(signer).toBeDefined();
    expect(alg).toEqual('EdDSA');
  });

  it('createJWT should work', async () => {
    const { encryptedSecretKey } = didvc.createDIDAccount(issuerPw);
    const { did: aud } = didvc.createDIDAccount(issuerPw);

    const payload: didJwtKit.JWTPayload<MyCredential> = {
      aud,
      name: 'aaa',
    };

    const jwt = await didvc.createJWT(payload, encryptedSecretKey, issuerPw);

    expect(typeof jwt).toEqual('string');
    expect(payload.iat).toBeDefined();
  });

  it.skip('createCredentialJWT should work', async () => {
    const issuerEncryptedSecretKey = didvc.encryptSecretKey(
      test2Account.sk,
      issuerPw
    );
    const { did: sub } = didvc.createDIDAccount(holderPw);

    const appIndex = await didvc.createRevokedApp(
      algod,
      issuerEncryptedSecretKey,
      issuerPw
    );

    try {
      console.log('Application Index:', appIndex);

      const payload: didvc.CredentialJWTPayload<MyCredential> = {
        sub,
        appIndex,
        vc: {
          '@context': didvc.DEFAULT_CONTEXT,
          type: didvc.DEFAULT_VC_TYPE,
          credentialSubject: {
            name: 'aaa',
            appIndex,
          },
        },
      };

      const jwt = await didvc.createCredentialJWT(
        payload,
        issuerEncryptedSecretKey,
        issuerPw
      );

      expect(typeof jwt).toEqual('string');
      expect(payload.iat).toBeDefined();
    } finally {
      await deleteApp(algod, appIndex, test2Account.sk);
    }
  });

  it.skip('createPresentationJWT should work', async () => {
    const issuerEncryptedSecretKey = didvc.encryptSecretKey(
      test2Account.sk,
      issuerPw
    );
    const { did: sub, encryptedSecretKey: holderEncryptedSecretKey } =
      didvc.createDIDAccount(holderPw);
    const { did: aud } = didvc.createDIDAccount(verifierPw);

    const appIndex = await didvc.createRevokedApp(
      algod,
      issuerEncryptedSecretKey,
      issuerPw
    );

    try {
      console.log('Application Index:', appIndex);

      const vcPayload: didvc.CredentialJWTPayload<MyCredential> = {
        sub,
        appIndex,
        vc: {
          '@context': didvc.DEFAULT_CONTEXT,
          type: didvc.DEFAULT_VC_TYPE,
          credentialSubject: {
            name: 'aaa',
            appIndex,
          },
        },
      };

      const vcJWT = await didvc.createCredentialJWT(
        vcPayload,
        issuerEncryptedSecretKey,
        issuerPw
      );

      const vpPayload: didvc.PresentationJWTPayload = {
        aud,
        vp: {
          '@context': [didvc.DEFAULT_CONTEXT],
          type: [didvc.DEFAULT_VP_TYPE],
          verifiableCredential: [vcJWT],
        },
      };

      const vpJWT = await didvc.createPresentationJWT(
        vpPayload,
        holderEncryptedSecretKey,
        holderPw
      );

      expect(vpJWT).toBeDefined();
      expect(vpPayload.iat).toBeDefined();
    } finally {
      await deleteApp(algod, appIndex, test2Account.sk);
    }
  });

  it('verifyJWT should work', async () => {
    const { encryptedSecretKey } = didvc.createDIDAccount(issuerPw);
    const { did: aud } = didvc.createDIDAccount(issuerPw);

    const payload: didvc.JWTPayload<MyCredential> = {
      aud,
      name: 'aaa',
    };

    const jwt = await didvc.createJWT(payload, encryptedSecretKey, issuerPw);
    const verifiedJWT = await didvc.verifyJWT<MyCredential>(jwt, aud);

    expect(verifiedJWT.verified).toBeTruthy();
    expect(verifiedJWT.payload.name).toEqual('aaa');
  });

  it.skip('verifyCredentialJWT should work', async () => {
    const issuerEncryptedSecretKey = didvc.encryptSecretKey(
      test2Account.sk,
      issuerPw
    );
    const { did: sub } = didvc.createDIDAccount(holderPw);

    const appIndex = await didvc.createRevokedApp(
      algod,
      issuerEncryptedSecretKey,
      issuerPw
    );

    try {
      console.log('Application Index:', appIndex);

      const payload: didvc.CredentialJWTPayload<MyCredential> = {
        sub,
        appIndex,
        vc: {
          '@context': didvc.DEFAULT_CONTEXT,
          type: didvc.DEFAULT_VC_TYPE,
          credentialSubject: {
            name: 'aaa',
            appIndex,
          },
        },
      };

      const vcJWT = await didvc.createCredentialJWT(
        payload,
        issuerEncryptedSecretKey,
        issuerPw
      );
      const verifiedJWT = await didvc.verifyCredentialJWT<MyCredential>(vcJWT);

      expect(verifiedJWT.verifiableCredential.credentialSubject.name).toEqual(
        'aaa'
      );
      expect(
        verifiedJWT.verifiableCredential.credentialSubject.appIndex
      ).toEqual(appIndex);
    } finally {
      await deleteApp(algod, appIndex, test2Account.sk);
    }
  });

  it.skip('verifyPresentationJWT should work', async () => {
    const issuerEncryptedSecretKey = didvc.encryptSecretKey(
      test2Account.sk,
      issuerPw
    );
    const { did: sub, encryptedSecretKey: holderEncryptedSecretKey } =
      didvc.createDIDAccount(holderPw);
    const { did: aud } = didvc.createDIDAccount(verifierPw);

    const appIndex = await didvc.createRevokedApp(
      algod,
      issuerEncryptedSecretKey,
      issuerPw
    );

    try {
      console.log('Application Index:', appIndex);

      const vcPayload: didvc.CredentialJWTPayload<MyCredential> = {
        sub,
        appIndex,
        vc: {
          '@context': didvc.DEFAULT_CONTEXT,
          type: didvc.DEFAULT_VC_TYPE,
          credentialSubject: {
            name: 'aaa',
            appIndex,
          },
        },
      };

      const vcJWT = await didvc.createCredentialJWT(
        vcPayload,
        issuerEncryptedSecretKey,
        issuerPw
      );

      const vpPayload: didvc.PresentationJWTPayload = {
        aud,
        vp: {
          '@context': [didvc.DEFAULT_CONTEXT],
          type: [didvc.DEFAULT_VP_TYPE],
          verifiableCredential: [vcJWT],
        },
      };

      const vpJWT = await didvc.createPresentationJWT(
        vpPayload,
        holderEncryptedSecretKey,
        holderPw
      );
      const verifiedVP = await didvc.verifyPresentationJWT(vpJWT, aud);

      expect(verifiedVP).toBeDefined();

      const typedVC = didvc.typedCredential(
        verifiedVP.verifiablePresentation.verifiableCredential[0]
      );
      expect(typedVC.credentialSubject.name).toEqual('aaa');
      expect(typedVC.credentialSubject.appIndex).toEqual(appIndex);
    } finally {
      await deleteApp(algod, appIndex, test2Account.sk);
    }
  });

  it('typedCredential should work', async () => {
    const vc: didJwtKit.VerifiableCredential = {
      '@context': [didJwtKit.DEFAULT_CONTEXT],
      type: [didJwtKit.DEFAULT_VC_TYPE],
      credentialSubject: {
        name: 'aaa',
        appIndex: 1,
      },
      issuer: {
        id: 'did:key:abc',
      },
      issuanceDate: '1234/12/31T12:34:56',
      proof: {
        type: 'hoge',
      },
    };

    const typedVC = didvc.typedCredential<MyCredential>(vc);

    expect(typedVC.credentialSubject.name).toEqual('aaa');
    expect(typedVC.credentialSubject.appIndex).toEqual(1);
  });

  it.skip('verifyCredentialStatus should work', async () => {
    const appIndex = await createRevokedApp(algod, test1Account.sk);
    const vc: didJwtKit.VerifiableCredential = {
      '@context': [didJwtKit.DEFAULT_CONTEXT],
      type: [didJwtKit.DEFAULT_VC_TYPE],
      credentialSubject: {
        name: 'aaa',
        appIndex,
      },
      issuer: {
        id: 'did:key:abc',
      },
      issuanceDate: '1234/12/31T12:34:56',
      proof: {
        type: 'hoge',
      },
    };

    try {
      console.log('Application Index:', appIndex);

      expect(await didvc.verifyCredentialStatus(algod, vc)).toBeTruthy();

      await setRevoked(algod, { appIndex, value: 1 }, test1Account.sk);

      expect(await didvc.verifyCredentialStatus(algod, vc)).toBeFalsy();
    } finally {
      await deleteApp(algod, appIndex, test1Account.sk);
    }
  });

  it.skip('verifyCredentialStatuses should work', async () => {
    const appIndex = await createRevokedApp(algod, test1Account.sk);
    const appIndex2 = await createRevokedApp(algod, test1Account.sk);

    const vc: didJwtKit.VerifiableCredential = {
      '@context': [didJwtKit.DEFAULT_CONTEXT],
      type: [didJwtKit.DEFAULT_VC_TYPE],
      credentialSubject: {
        name: 'aaa',
        appIndex,
      },
      issuer: {
        id: 'did:key:abc',
      },
      issuanceDate: '1234/12/31T12:34:56',
      proof: {
        type: 'hoge',
      },
    };
    const vc2: didJwtKit.VerifiableCredential = {
      '@context': [didJwtKit.DEFAULT_CONTEXT],
      type: [didJwtKit.DEFAULT_VC_TYPE],
      credentialSubject: {
        name: 'bbb',
        appIndex2,
      },
      issuer: {
        id: 'did:key:abc',
      },
      issuanceDate: '1234/12/31T12:34:56',
      proof: {
        type: 'hoge',
      },
    };

    try {
      console.log('Application Index:', appIndex);
      console.log('Application Index2:', appIndex2);

      expect(await didvc.verifyCredentialStatuses(algod, [vc, vc2])).toEqual([
        true,
        true,
      ]);

      await setRevoked(algod, { appIndex, value: 1 }, test1Account.sk);

      expect(await didvc.verifyCredentialStatuses(algod, [vc, vc2])).toEqual([
        false,
        true,
      ]);
    } finally {
      await deleteAllApps(indexer, algod, test1Account.sk);
    }
  });

  it.skip('deleteAllApps should work', async () => {
    const encryptSecretKey = didvc.encryptSecretKey(test2Account.sk, issuerPw);
    const appIndex = await createRevokedApp(algod, test2Account.sk);

    try {
      expect(
        (await getAppIndexes(indexer, test2Account.addr)).length
      ).toBeGreaterThan(0);

      await didvc.deleteAllApps(indexer, algod, encryptSecretKey, issuerPw);

      expect((await getAppIndexes(indexer, test2Account.addr)).length).toEqual(
        0
      );
    } finally {
      const appIndexes = await getAppIndexes(indexer, test2Account.addr);

      if (appIndexes.indexOf(appIndex) >= 0) {
        await deleteApp(algod, appIndex, test2Account.sk);
      }
    }
  });

  it.skip('createRevokedApp should work', async () => {
    const encryptSecretKey = didvc.encryptSecretKey(test2Account.sk, issuerPw);
    const appNum = (await getAppIndexes(indexer, test2Account.addr)).length;
    const appIndex = await didvc.createRevokedApp(
      algod,
      encryptSecretKey,
      issuerPw
    );

    console.log('Application Index:', appIndex);

    try {
      expect((await getAppIndexes(indexer, test2Account.addr)).length).toEqual(
        appNum + 1
      );
    } finally {
      await deleteApp(algod, appIndex, test2Account.sk);
    }
  });
});
