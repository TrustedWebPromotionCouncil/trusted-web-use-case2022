import { useErrorHandler } from 'react-error-boundary';
import { useRecoilValue } from 'recoil';

import holderDIDAccountState from '@/lib/states/holderDIDAccount2State';
import issuerDIDAccountState from '@/lib/states/issuerDIDAccount2State';
import verifierDidAccountState from '@/lib/states/verifierDIDAccount2State';
import { holderPw, issuerPw } from '@/lib/algo/account/accounts';
import * as didvc from '@/lib/didvc';
import setRevokedOriginal from '@/lib//algo/api/setRevoked';

import { SubsidyContent, VCContent } from '../types';
import { getAlgod } from '@/lib/algo/algod/algods';
import chainState from '@/lib/states/chainState';
import { residentVCList2State } from '../states/vc/ResidentVCList2State';
import { accountVCList2State } from '../states/vc/AccountVCList2State';
import { taxVCList2State } from '../states/vc/TaxVCList2State';
import { isSubsidyContent } from '../utils/typeGuard';

const useVCHandler = () => {
  // hooks
  const errorHandler = useErrorHandler();

  //   Recoil
  const chainType = useRecoilValue(chainState);
  const holderDIDAccountGlobal = useRecoilValue(holderDIDAccountState);
  const issuerDIDAccountGlobal = useRecoilValue(issuerDIDAccountState);
  const verifierDIDAccountGlobal = useRecoilValue(verifierDidAccountState);

  const residentVCList = useRecoilValue(residentVCList2State);
  const accountVCList = useRecoilValue(accountVCList2State);
  const taxVCList = useRecoilValue(taxVCList2State);

  //   VP作成
  const createVP = async (
    residentVC: string,
    accountVC: string,
    taxVC: string
  ): Promise<string | undefined> => {
    if (holderDIDAccountGlobal && verifierDIDAccountGlobal) {
      const verifiableCredential: string[] = [];
      if (residentVC !== '-1' && residentVCList) {
        const listItem = residentVCList[Number(residentVC)];
        listItem && verifiableCredential.push(listItem.jwt);
      }
      if (accountVC !== '-1' && accountVCList) {
        const listItem = accountVCList[Number(accountVC)];
        listItem && verifiableCredential.push(listItem.jwt);
      }
      if (taxVC !== '-1' && taxVCList) {
        const listItem = taxVCList[Number(taxVC)];
        listItem && verifiableCredential.push(listItem.jwt);
      }

      const payload: didvc.PresentationJWTPayload = {
        aud: verifierDIDAccountGlobal.did,
        vp: {
          '@context': [didvc.DEFAULT_CONTEXT],
          type: [didvc.DEFAULT_VP_TYPE],
          verifiableCredential: verifiableCredential,
        },
      };

      return await didvc.createPresentationJWT(
        payload,
        holderDIDAccountGlobal.encryptedSecretKey,
        holderPw
      );
    }
    return undefined;
  };

  //   Request作成
  const createVCRequest = async (
    content: VCContent
  ): Promise<string | undefined> => {
    try {
      if (holderDIDAccountGlobal && issuerDIDAccountGlobal) {
        if (isSubsidyContent(content)) {
          const vp = await createVP(
            content.residentVC,
            content.accountVC,
            content.taxVC
          );
          if (vp) {
            const payload: didvc.JWTPayload<SubsidyContent> = {
              aud: issuerDIDAccountGlobal.did,
              ...content,
              vp,
            };
            return await didvc.createJWT(
              payload,
              holderDIDAccountGlobal.encryptedSecretKey,
              holderPw
            );
          }
          throw new Error('vp is undefined');
        } else {
          const payload: didvc.JWTPayload<VCContent> = {
            aud: issuerDIDAccountGlobal.did,
            ...content,
          };
          return await didvc.createJWT(
            payload,
            holderDIDAccountGlobal.encryptedSecretKey,
            holderPw
          );
        }
      }
      throw new Error(
        'holderDIDAccountGlobal or issuerDIDAccountGlobal is undefined'
      );
    } catch (e) {
      errorHandler(e);
    }
    return undefined;
  };

  //   Request検証
  const verifyVCRequest = async (
    jwt: string
  ): Promise<didvc.VerifiedJWT<VCContent> | undefined> => {
    try {
      if (issuerDIDAccountGlobal) {
        return await didvc.verifyJWT<VCContent>(
          jwt,
          issuerDIDAccountGlobal.did
        );
      }
      throw new Error('issuerDIDAccountGlobal is undefined');
    } catch (e) {
      errorHandler(e);
    }
    return undefined;
  };

  //   VC作成
  const createVC = async (
    content: didvc.JWTPayload & VCContent
  ): Promise<string | undefined> => {
    try {
      if (issuerDIDAccountGlobal && holderDIDAccountGlobal) {
        const algod = getAlgod(chainType);
        const appIndex = await didvc.createRevokedApp(
          algod,
          issuerDIDAccountGlobal.encryptedSecretKey,
          issuerPw
        );
        const payload: didvc.CredentialJWTPayload<VCContent> = {
          sub: holderDIDAccountGlobal.did,
          vc: {
            '@context': [didvc.DEFAULT_CONTEXT],
            type: [didvc.DEFAULT_VC_TYPE],
            credentialSubject: {
              ...content,
              appIndex,
            },
          },
        };
        return await didvc.createCredentialJWT(
          payload,
          issuerDIDAccountGlobal.encryptedSecretKey,
          issuerPw
        );
      }
      throw new Error(
        'holderDIDAccountGlobal or issuerDIDAccountGlobal is undefined'
      );
    } catch (e) {
      errorHandler(e);
    }
    return undefined;
  };

  //   VC検証
  const verifyVC = async (
    jwt: string
  ): Promise<
    | {
        verifiedJWT: didvc.VerifiedCredentialJWT<VCContent>;
        revoked: boolean;
      }
    | undefined
  > => {
    try {
      const algod = getAlgod(chainType);
      const verifiedJWT = await didvc.verifyCredentialJWT<VCContent>(jwt);
      const revoked = await didvc.verifyCredentialStatus(
        algod,
        verifiedJWT.verifiableCredential
      );

      return { verifiedJWT, revoked };
    } catch (e) {
      errorHandler(e);
    }
    return undefined;
  };

  const verifyVP = async (
    jwt: string
  ): Promise<
    | {
        verifiedJWT: didvc.VerifiedPresentationJWT;
        vcsRevoked: boolean[];
        vpRevoked: boolean;
      }
    | undefined
  > => {
    try {
      if (verifierDIDAccountGlobal) {
        const algod = getAlgod(chainType);
        const verifiedJWT = await didvc.verifyPresentationJWT(
          jwt,
          verifierDIDAccountGlobal.did
        );
        const vcsRevoked = await didvc.verifyCredentialStatuses(
          algod,
          verifiedJWT.verifiablePresentation.verifiableCredential
        );
        const vpRevoked = vcsRevoked.every((status) => status);
        return {
          verifiedJWT,
          vcsRevoked,
          vpRevoked,
        };
      }
      throw new Error('verifierDIDAccountGlobal is undefined');
    } catch (e) {
      errorHandler(e);
    }
    return undefined;
  };

  const revokeVC = async (
    verifiedJWT: didvc.VerifiedCredentialJWT<VCContent>,
    value = 1
  ) => {
    if (issuerDIDAccountGlobal) {
      const algod = getAlgod(chainType);
      const secretKey = didvc.decryptSecretKey(
        issuerDIDAccountGlobal.encryptedSecretKey,
        issuerPw
      );
      const appIndex = verifiedJWT.payload.vc.credentialSubject.appIndex;
      await setRevokedOriginal(algod, { appIndex, value }, secretKey);
    }
  };

  return {
    createVCRequest,
    verifyVCRequest,
    createVC,
    verifyVC,
    verifyVP,
    revokeVC,
  };
};

export default useVCHandler;
