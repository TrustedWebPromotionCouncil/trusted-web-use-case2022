import * as u8a from 'uint8arrays';
import * as algosdk from 'algosdk';
import * as didJwtKit from 'did-jwt-toolkit';

import * as cryptUtils from '../utils/cryptUtils';
import getGlobalState from '../algo/api/getGlobalState';
import deleteAllAppsOriginal from '../algo/api/deleteAllApps';
import createRevokedAppOriginal from '../algo/api/createRevokedApp';
import { DIDAccount, Revocable } from '../types';

const driver = didJwtKit.getDIDKeyDriver('EdDSA');

export const DEFAULT_CONTEXT = didJwtKit.DEFAULT_CONTEXT;
export const DEFAULT_VC_TYPE = didJwtKit.DEFAULT_VC_TYPE;
export const DEFAULT_VP_TYPE = didJwtKit.DEFAULT_VP_TYPE;

export type JWTPayload<T = unknown> = didJwtKit.JWTPayload<T>;
export type CredentialJWTPayload<T = Record<string, any>> =
  didJwtKit.CredentialJWTPayload<T & Revocable>;
export type PresentationJWTPayload = didJwtKit.PresentationJWTPayload;

export type VerifiedJWT<T> = didJwtKit.VerifiedJWT<T>;
export type VerifiedCredentialJWT<T> = didJwtKit.VerifiedCredentialJWT<
  T & Revocable
>;
export type VerifiedPresentationJWT = didJwtKit.VerifiedPresentationJWT;

export const encryptSecretKey = (
  secretKey: Uint8Array,
  password: string
): string => {
  const encryptBytes = cryptUtils.encryptByPassword(secretKey, password);

  return u8a.toString(encryptBytes, 'base64url');
};

export const decryptSecretKey = (
  encryptSecretKey: string,
  password: string
): Uint8Array => {
  const encryptBytes = u8a.fromString(encryptSecretKey, 'base64url');

  return cryptUtils.decryptByPassword(encryptBytes, password);
};

export const createDIDAccount = (password: string): DIDAccount => {
  const { secretKey, publicKey } = driver.generateKeyPair();
  const did = driver.didFromPublicKey(publicKey);
  const address = algosdk.encodeAddress(publicKey);
  const encryptedSecretKey = encryptSecretKey(secretKey, password);

  return { did, address, encryptedSecretKey };
};

export const issuerFromEncryptedSecretKey = (
  encryptedSecretKey: string,
  password: string
): didJwtKit.Issuer => {
  const secretKey = decryptSecretKey(encryptedSecretKey, password);
  const keyPair = driver.keyPairFromSecretKey(secretKey);

  return driver.issuerFromKeyPair(keyPair);
};

const assignIat = (payload: JWTPayload): void => {
  if (!payload.iat) {
    payload.iat = Date.now() / 1000;
  }
};

export const createJWT = async (
  payload: JWTPayload,
  encryptedSecretKey: string,
  password: string
): Promise<string> => {
  assignIat(payload);

  const issuer = issuerFromEncryptedSecretKey(encryptedSecretKey, password);

  return didJwtKit.createJWT(payload, issuer);
};

export const createCredentialJWT = async (
  payload: CredentialJWTPayload,
  encryptedSecretKey: string,
  password: string
): Promise<string> => {
  assignIat(payload);

  const issuer = issuerFromEncryptedSecretKey(encryptedSecretKey, password);

  return didJwtKit.createCredentialJWT(payload, issuer);
};

export const createPresentationJWT = async (
  payload: PresentationJWTPayload,
  encryptedSecretKey: string,
  password: string
): Promise<string> => {
  assignIat(payload);

  const issuer = issuerFromEncryptedSecretKey(encryptedSecretKey, password);

  return didJwtKit.createPresentationJWT(payload, issuer);
};

export const verifyJWT = async <T>(
  jwt: string,
  audience: string
): Promise<VerifiedJWT<T>> => {
  const options: didJwtKit.VerifyJWTOptions = {
    audience,
  };
  const resolver = new didJwtKit.Resolver(driver.getResolverRegistry());

  return didJwtKit.verifyJWT<T>(jwt, resolver, options);
};

export const verifyCredentialJWT = async <T>(
  jwt: string
): Promise<VerifiedCredentialJWT<T>> => {
  const resolver = new didJwtKit.Resolver(driver.getResolverRegistry());

  return didJwtKit.verifyCredentialJWT<T & Revocable>(jwt, resolver);
};

export const verifyPresentationJWT = async <T>(
  jwt: string,
  audience: string
): Promise<VerifiedPresentationJWT> => {
  const options: didJwtKit.VerifyPresentationJWTOptions = {
    audience,
  };
  const resolver = new didJwtKit.Resolver(driver.getResolverRegistry());

  return didJwtKit.verifyPresentationJWT(jwt, resolver, options);
};

export const typedCredential = <T>(
  credential: didJwtKit.VerifiableCredential
): didJwtKit.VerifiableCredential<T & Revocable> => {
  return credential as didJwtKit.VerifiableCredential<T & Revocable>;
};

export const deleteAllApps = async (
  indexer: algosdk.Indexer,
  algod: algosdk.Algodv2,
  encryptSecretKey: string,
  password: string
): Promise<void> => {
  await deleteAllAppsOriginal(
    indexer,
    algod,
    decryptSecretKey(encryptSecretKey, password)
  );
};

export const createRevokedApp = async (
  algod: algosdk.Algodv2,
  encryptedSecretKey: string,
  password: string
): Promise<number> => {
  return createRevokedAppOriginal(
    algod,
    decryptSecretKey(encryptedSecretKey, password)
  );
};

export const verifyCredentialStatus = async (
  algod: algosdk.Algodv2,
  credential: didJwtKit.VerifiableCredential
): Promise<boolean> => {
  try {
    if (credential.credentialSubject.appIndex) {
      const state = await getGlobalState(
        algod,
        credential.credentialSubject.appIndex
      );

      return state.revoked === 0;
    } else {
      return true;
    }
  } catch (ignore) {
    return false;
  }
};

export const verifyCredentialStatuses = async (
  algod: algosdk.Algodv2,
  credentials: didJwtKit.VerifiableCredential[]
): Promise<boolean[]> => {
  const vcStatusPromises = credentials.map((credential) => {
    return verifyCredentialStatus(algod, credential);
  });

  return Promise.all(vcStatusPromises);
};
