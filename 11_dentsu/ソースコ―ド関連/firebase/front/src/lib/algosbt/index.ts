import {
  generateAccount,
  decodeAddress,
  encodeObj,
  decodeObj,
  Algodv2,
} from 'algosdk';

import {
  DidAccount,
  VerifiableMessage,
  VerifiableCredential,
  VerifiableCredentialContent,
  VerifiablePresentation,
  VerifiablePresentationContent,
  Message,
  VerifiablePresentationVerified,
} from './types';
import { encryptByPassword, decryptByPassword } from './utils/cryptUtils';
import { addressFromSecretKey } from './utils/algosdkUtils';
import { sign, verify } from './utils/naclUtils';
import createRevokedApp from './transactions/createRevokedApp';
import setRevoked from './transactions/setRevoked';
import getGlobalState from './algod/getGlobalState';
import * as didUtils from './utils/didUtils';

export const createDidAccount = (password: string): DidAccount => {
  const account = generateAccount();
  const encSecretKey = Buffer.from(
    encryptByPassword(account.sk, password)
  ).toString('base64');
  const address = account.addr;
  const did = didUtils.didFromAddress(address);

  return { did, address, encSecretKey };
};

export const restoreDidAccount = (
  encSecretKey: string,
  password: string
): DidAccount => {
  const secretKey = decryptByPassword(
    Buffer.from(encSecretKey, 'base64'),
    password
  );
  const address = addressFromSecretKey(secretKey);
  const did = didUtils.didFromAddress(address);

  return { did, address, encSecretKey };
};

export const createVerifiableMessage = <T>(
  senderDidAccount: DidAccount,
  receiverDid: string,
  content: T,
  password: string
): VerifiableMessage<T> => {
  const message: Message<T> = {
    senderDid: senderDidAccount.did,
    receiverDid,
    content,
  };
  const encodedMessage = encodeObj(message);
  const secretKey = decryptByPassword(
    Buffer.from(senderDidAccount.encSecretKey, 'base64'),
    password
  );
  const signature = Buffer.from(sign(encodedMessage, secretKey)).toString(
    'base64'
  );

  const vm: VerifiableMessage<T> = {
    message: decodeObj(encodedMessage),
    signature,
  };

  return vm;
};

export const verifyVerifiableMessage = (vm: VerifiableMessage<unknown>) => {
  const address = didUtils.addressFromDid(vm.message.senderDid);
  const { publicKey } = decodeAddress(address);
  const encodedMessage = encodeObj(vm.message);
  const signature = Uint8Array.from(Buffer.from(vm.signature, 'base64'));

  return verify(encodedMessage, signature, publicKey);
};

export type CreateVCParams<T> = {
  holderDid: string;
  content: T;
};

export const createVerifiableCredential = async <T>(
  algod: Algodv2,
  issuerDidAccount: DidAccount,
  holderDid: string,
  content: T,
  password: string
) => {
  const secretKey = decryptByPassword(
    Buffer.from(issuerDidAccount.encSecretKey, 'base64'),
    password
  );
  const from = addressFromSecretKey(secretKey);
  const appIndex = await createRevokedApp(algod, { from }, secretKey);
  const vcContent: VerifiableCredentialContent<T> = {
    appIndex,
    content,
  };

  return createVerifiableMessage(
    issuerDidAccount,
    holderDid,
    vcContent,
    password
  );
};

export const verifyVerifiableCredential = async (
  algod: Algodv2,
  vc: VerifiableCredential<unknown>
) => {
  try {
    if (!verifyVerifiableMessage(vc)) {
      return false;
    }

    const appIndex = vc.message.content.appIndex;

    const state = await getGlobalState(algod, appIndex);

    return state.revoked === 0;
  } catch (ignore) {}

  return false;
};

export const revokeVerifiableCredential = async (
  algod: Algodv2,
  issuerDidAccount: DidAccount,
  vc: VerifiableCredential<unknown>,
  password: string,
  value = 1
) => {
  const from = didUtils.addressFromDid(issuerDidAccount.did);
  const appIndex = vc.message.content.appIndex;
  const issuerSecretKey = decryptByPassword(
    Buffer.from(issuerDidAccount.encSecretKey, 'base64'),
    password
  );

  await setRevoked(algod, { from, appIndex, value }, issuerSecretKey);
};

export const createVerifiablePresentation = async (
  holderDidAccount: DidAccount,
  verifierDid: string,
  credentials: VerifiableCredential[],
  password: string
) => {
  const vpContent: VerifiablePresentationContent = {
    credentials,
  };

  return createVerifiableMessage(
    holderDidAccount,
    verifierDid,
    vpContent,
    password
  );
};

export const verifyVerifiablePresentation = async (
  algod: Algodv2,
  vp: VerifiablePresentation
): Promise<VerifiablePresentationVerified> => {
  try {
    const vcsVerifiedPromises = vp.message.content.credentials.map((vc) =>
      verifyVerifiableCredential(algod, vc)
    );
    const vcsVerified = await Promise.all(vcsVerifiedPromises);
    const vpVerified =
      verifyVerifiableMessage(vp) && vcsVerified.every((v) => v);

    return { vpVerified, vcsVerified };
  } catch (ignore) {}

  const vcsVerified = Array<boolean>(
    vp.message.content.credentials.length
  ).fill(false);

  return { vpVerified: false, vcsVerified };
};
